<?php

namespace App\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;

#[ODM\Document(collection: 'patentes')]
class InpiPatent
{
    #[ODM\Id]
    private $id;

    #[ODM\Field(type: 'string')]
    private $patent_id;

    #[ODM\Field(type: 'string')]
    private $application_date;

    #[ODM\Field(type: 'string')]
    private $grant_date;

    #[ODM\Field(type: 'collection')]
    private $cpc_codes;

    #[ODM\Field(type: 'string')]
    private $title;

    #[ODM\Field(type: 'collection')]
    private $titular;

    #[ODM\Field(type: 'collection')]
    private $inventors;

    #[ODM\Field(type: 'string')]
    private $source_file;

    #[ODM\Field(type: 'string')]
    private $full_text;

    #[ODM\Field(type: 'date')]
    private $created_at;

    // --- Getters e Setters ---

    public function getId(): ?string
    {
        return $this->id;
    }

    public function getPatentId(): ?string
    {
        return $this->patent_id;
    }

    public function setPatentId(string $patent_id): self
    {
        $this->patent_id = $patent_id;
        return $this;
    }

    public function getApplicationDate(): ?string
    {
        return $this->application_date;
    }

    public function setApplicationDate(string $application_date): self
    {
        $this->application_date = $application_date;
        return $this;
    }

    public function getGrantDate(): ?string
    {
        return $this->grant_date;
    }

    public function setGrantDate(string $grant_date): self
    {
        $this->grant_date = $grant_date;
        return $this;
    }

    public function getCpcCodes(): ?array
    {
        return $this->cpc_codes;
    }

    public function setCpcCodes(array $cpc_codes): self
    {
        $this->cpc_codes = $cpc_codes;
        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;
        return $this;
    }

    public function getTitular(): ?array
    {
        return $this->titular;
    }

    public function setTitular(array $titular): self
    {
        $this->titular = $titular;
        return $this;
    }

    public function getInventors(): ?array
    {
        return $this->inventors;
    }

    public function setInventors(array $inventors): self
    {
        $this->inventors = $inventors;
        return $this;
    }

    public function getSourceFile(): ?string
    {
        return $this->source_file;
    }

    public function setSourceFile(string $source_file): self
    {
        $this->source_file = $source_file;
        return $this;
    }

    public function getFullText(): ?string
    {
        return $this->full_text;
    }

    public function setFullText(string $full_text): self
    {
        $this->full_text = $full_text;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeInterface $created_at): self
    {
        $this->created_at = $created_at;
        return $this;
    }
}
