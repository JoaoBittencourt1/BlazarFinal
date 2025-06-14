<?php

namespace App\Command;

use App\Document\InpiPatent;
use Doctrine\ODM\MongoDB\DocumentManager;
use Smalot\PdfParser\Parser;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
    name: 'app:extrair-inpi-patente',
    description: 'Extrai dados de um PDF do INPI e salva no MongoDB.',
)]
class ExtractInpiPatentCommand extends Command
{
    private DocumentManager $dm;

    public function __construct(DocumentManager $dm)
    {
        parent::__construct();
        $this->dm = $dm;
    }

    protected function configure(): void
    {
        $this
            ->addArgument('path', InputArgument::REQUIRED, 'Caminho do PDF');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $path = $input->getArgument('path');

        if (!file_exists($path)) {
            $output->writeln("<error>Arquivo não encontrado: $path</error>");
            return Command::FAILURE;
        }

        $parser = new Parser();
        $pdf = $parser->parseFile($path);
        $text = $pdf->getText();

        $cpcsValidos = ['A61K', 'C12Q', 'C07K', 'G01N'];

        preg_match('/Classificação Internacional:\s*(.*)/i', $text, $match);
        $cpcEncontrado = isset($match[1]) ? explode(';', $match[1]) : [];

        $temBiotecnologia = false;
        foreach ($cpcEncontrado as $cpc) {
            foreach ($cpcsValidos as $valid) {
                if (stripos($cpc, $valid) !== false) {
                    $temBiotecnologia = true;
                    break 2;
                }
            }
        }

        if (!$temBiotecnologia) {
            $output->writeln("<comment>Patente ignorada (não é biotecnologia)</comment>");
            return Command::SUCCESS;
        }

        preg_match('/Número do Depósito:\s*(BR\s*\d+)/i', $text, $m);
        $patentId = trim($m[1] ?? '');

        preg_match('/Data do Depósito:\s*([\d\/]+)/i', $text, $m);
        $applicationDate = trim($m[1] ?? '');

        preg_match('/Data da Publicação Nacional:\s*([\d\/]+)/i', $text, $m);
        $grantDate = trim($m[1] ?? '');

        preg_match('/Título:\s*(.*?)\n/i', $text, $m);
        $title = strtolower(trim($m[1] ?? ''));

        preg_match('/Titular:\s*(.*?)(Inventor:|Prazo de Validade)/is', $text, $m);
        $titularTexto = trim($m[1] ?? '');
        $titulares = array_map(
            fn($t) => strtoupper(trim(explode(',', $t)[0])),
            explode(';', $titularTexto)
        );

        preg_match('/Inventor:\s*(.*?)\n/i', $text, $m);
        $inventores = array_map('ucwords', array_map('trim', explode(';', $m[1] ?? '')));

        $documento = new InpiPatent();
        $documento->setPatentId($patentId);
        $documento->setApplicationDate($applicationDate);
        $documento->setGrantDate($grantDate);
        $documento->setCpcCodes(array_map('trim', $cpcEncontrado));
        $documento->setTitle($title);
        $documento->setTitular($titulares);
        $documento->setInventors($inventores);
        $documento->setSourceFile(basename($path));
        $documento->setFullText($text);
        $documento->setCreatedAt(new \DateTime());

        $this->dm->persist($documento);
        $this->dm->flush();

        $output->writeln("<info>✅ Patente salva com sucesso na coleção 'patentes'</info>");
        return Command::SUCCESS;
    }
}


