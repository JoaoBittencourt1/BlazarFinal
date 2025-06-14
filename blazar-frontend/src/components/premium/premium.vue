<template>
  <div class="pagina-premium">
    <form @submit.prevent="onSubmit">
      <div class="tabela">
        <div class="cabecalho">
          <div class="titulo">Dados {{ tipoPlano === 'pf' ? 'Pessoais' : 'da Empresa' }}</div>
          <div class="titulo">Endereço de cobrança</div>
        </div>

        <div class="colunas">
          <div class="coluna">
            <div class="campo">
              <label for="nome">{{ tipoPlano === 'pf' ? 'Nome completo' : 'Razão Social' }}</label>
              <input id="nome" type="text" v-model="nome" />
            </div>

            <div class="grupo-horizontal">
              <div class="campo">
                <label for="documento">{{ tipoPlano === 'pf' ? 'CPF' : 'CNPJ' }}</label>
                <input id="documento" type="text" v-model="documento" />
                <p v-if="documento && !documentoValido" style="color: red; font-size: 14px;">
                  {{ tipoPlano === 'pf' ? 'CPF inválido.' : 'CNPJ inválido.' }}
                </p>
              </div>

              <div class="campo" v-if="tipoPlano === 'pf'">
                <label for="nascimento">Data de nascimento</label>
                <input id="nascimento" type="date" v-model="nascimento" />
              </div>
            </div>

            <div class="campo">
              <label for="email">E-mail</label>
              <input id="email" type="email" v-model="email" @input="validarEmail" />
              <p v-if="email && !emailValido" style="color: red; font-size: 14px;">E-mail inválido.</p>
            </div>

            <div class="campo">
              <label for="senha">Senha</label>
              <input id="senha" type="password" v-model="senha" @input="validarSenha" />
              <p v-if="senha && !senhaValida" style="color: red; font-size: 14px;">
                A senha deve ter no mínimo 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.
              </p>
            </div>
          </div>

          <div class="coluna">
            <div class="grupo-horizontal">
              <div class="campo">
                <label for="cep">CEP</label>
                <input id="cep" type="text" v-model="cep" @blur="buscarEnderecoPorCEP" />
              </div>

              <div class="campo">
                <label for="pontoDeReferencia">Ponto de referência</label>
                <input id="pontoDeReferencia" type="text" v-model="pontoDeReferencia" />
              </div>
            </div>

            <div class="grupo-horizontal">
              <div class="campo endereco">
                <label for="endereco">Endereço</label>
                <input id="endereco" type="text" v-model="endereco" />
              </div>

              <div class="campo numero">
                <label for="numeroDaCasa">Número</label>
                <input id="numeroDaCasa" type="number" v-model="numeroDaCasa" />
              </div>
            </div>

            <div class="campo">
              <label for="complemento">Complemento</label>
              <input id="complemento" type="text" v-model="complemento" />
            </div>

            <div class="grupo-horizontal">
              <div class="campo">
                <label for="cidade">Cidade</label>
                <select id="cidade" v-model="cidade">
                  <option value="" disabled selected>Selecione a cidade</option>
                  <option v-for="cidadeItem in cidades" :key="cidadeItem.id" :value="cidadeItem.nome">
                    {{ cidadeItem.nome }}
                  </option>
                </select>
              </div>

              <div class="campo">
                <label for="estado">Estado</label>
                <select id="estado" @change="carregarCidades" v-model="estado">
                  <option value="" disabled selected>Selecione o estado</option>
                  <option v-for="estadoItem in estados" :key="estadoItem.id" :value="estadoItem.id">
                    {{ estadoItem.nome }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="rodape">
          <a class="testar-ferramenta" @click.prevent="irParaSolicitacao">Testar ferramenta gratuitamente</a>

          <div class="termos">
            <div class="termo">
              <input id="checkTermoUso" type="checkbox" v-model="termosUso" />
              <label for="checkTermoUso">
                Eu li e concordo com os
                <a target="_blank" href="https://drive.google.com/file/d/1nVks_cwwPFoiZKc7nQOP5PmZ-oDh7nLN/view?usp=sharing">
                  termos e condições de uso
                </a>.
              </label>
            </div>

            <div class="termo">
              <input id="checkPolPriv" type="checkbox" v-model="termosPrivacidade" />
              <label for="checkPolPriv">
                Eu li e concordo com os termos da
                <a target="_blank" href="https://drive.google.com/file/d/1nVks_cwwPFoiZKc7nQOP5PmZ-oDh7nLN/view?usp=sharing">
                  Política de privacidade
                </a>.
              </label>
            </div>
          </div>
          <input id="btnAvancar" type="submit" value="Avançar" :disabled="!formValido" />
        </div>
      </div>
    </form>
  </div>
</template>


<script>
import { useRouter, useRoute } from "vue-router";
import { ref, onMounted, computed } from "vue";
import "./premium.scss";
import axios from "axios";
import { supabase } from "../../supabase";

export default {
  name: "PremiumPage",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const tipoPlano = ref(route.query.plano || "pf");

    const nome = ref("");
    const documento = ref("");
    const nascimento = ref("");
    const email = ref("");
    const emailValido = ref(false);
    const senha = ref("");
    const senhaValida = ref(false);
    const cep = ref("");
    const endereco = ref("");
    const numeroDaCasa = ref("");
    const complemento = ref("");
    const estado = ref("");
    const cidade = ref("");
    const pontoDeReferencia = ref("");
    const termosUso = ref(false);
    const termosPrivacidade = ref(false);
    const estados = ref([]);
    const cidades = ref([]);
    const usuarioId = ref(null);

    const validarSenha = () => {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;
      senhaValida.value = regex.test(senha.value);
    };

    const validarEmail = () => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      emailValido.value = regex.test(email.value);
    };

    const validarCPF = (cpfStr) => {
      const cpf = cpfStr.replace(/[^\d]+/g, "");
      if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
      let soma = 0;
      for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
      let digito1 = 11 - (soma % 11);
      if (digito1 >= 10) digito1 = 0;
      if (digito1 !== parseInt(cpf.charAt(9))) return false;
      soma = 0;
      for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
      let digito2 = 11 - (soma % 11);
      if (digito2 >= 10) digito2 = 0;
      return digito2 === parseInt(cpf.charAt(10));
    };

    const validarCNPJ = (cnpjStr) => {
      const cnpj = cnpjStr.replace(/[^\d]+/g, "");
      if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
      let t = cnpj.length - 2,
        d = cnpj.substring(t),
        d1 = parseInt(d.charAt(0)),
        d2 = parseInt(d.charAt(1)),
        calc = (x) => {
          let n = cnpj.substring(0, x),
            y = x - 7,
            s = 0,
            r = 0;
          for (let i = x; i >= 1; i--) {
            s += n.charAt(x - i) * y--;
            if (y < 2) y = 9;
          }
          r = 11 - (s % 11);
          return r > 9 ? 0 : r;
        };
      return calc(t) === d1 && calc(t + 1) === d2;
    };

    const documentoValido = computed(() => {
      return tipoPlano.value === "pf"
        ? validarCPF(documento.value)
        : validarCNPJ(documento.value);
    });

    const formValido = computed(() => {
      return (
        nome.value &&
        documento.value &&
        documentoValido.value &&
        email.value &&
        emailValido.value &&
        senha.value &&
        senhaValida.value &&
        cep.value &&
        endereco.value &&
        numeroDaCasa.value &&
        estado.value &&
        cidade.value &&
        termosUso.value &&
        termosPrivacidade.value &&
        (tipoPlano.value === "pj" || nascimento.value)
      );
    });

    onMounted(() => {
      fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
        .then((res) => res.json())
        .then((data) => {
          estados.value = data.sort((a, b) => a.nome.localeCompare(b.nome));
        });
    });

    const carregarCidades = async () => {
      if (estado.value) {
        try {
          const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado.value}/municipios`);
          const data = await res.json();
          cidades.value = data;
        } catch (error) {
          console.error("Erro ao carregar cidades:", error);
        }
      } else {
        cidades.value = [];
      }
    };

    const buscarEnderecoPorCEP = async () => {
      const cepLimpo = cep.value.replace(/\D/g, "");
      if (!/^\d{8}$/.test(cepLimpo)) return;

      try {
        const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await res.json();

        if (data.erro) return alert("CEP não encontrado.");

        endereco.value = data.logradouro || "";
        complemento.value = data.complemento || "";
        pontoDeReferencia.value = data.bairro || "";

        const estadoMatch = estados.value.find((uf) => uf.sigla === data.uf);
        if (estadoMatch) {
          estado.value = estadoMatch.id;
          await carregarCidades();
          const cidadeMatch = cidades.value.find(
            (c) => c.nome.toLowerCase() === data.localidade.toLowerCase()
          );
          if (cidadeMatch) cidade.value = cidadeMatch.nome;
        }
      } catch (error) {
        console.error("Erro ao buscar o CEP:", error);
      }
    };

    const onSubmit = async () => {
      if (!formValido.value) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
      }

      try {
        const { error } = await supabase.auth.signUp({
          email: email.value,
          password: senha.value,
        });
        if (error) return alert("Erro ao criar conta no Supabase: " + error.message);

        const payload = {
          nome: nome.value,
          documento: documento.value,
          tipoPlano: tipoPlano.value,
          nascimento: tipoPlano.value === "pf" ? nascimento.value : null,
          email: email.value,
          cep: cep.value,
          endereco: endereco.value,
          numeroDaCasa: numeroDaCasa.value,
          complemento: complemento.value,
          estado: estado.value,
          cidade: cidade.value,
          pontoDeReferencia: pontoDeReferencia.value,
        };

        const res = await axios.post("http://localhost:1500/api/premium", payload);
if (res.status === 201 && res.data.success) {
  usuarioId.value = res.data.id;
  router.push({
    path: `/pagamento/${usuarioId.value}`,
    query: { plano: payload.tipoPlano }, // <-- ESSENCIAL
  });
} else {
  alert("Erro ao salvar os dados.");
}

      } catch (error) {
        if (error.response?.status === 409) {
          alert("Este documento já está cadastrado.");
        } else {
          console.error("Erro ao enviar dados:", error);
          alert("Erro ao salvar os dados. Verifique e tente novamente.");
        }
      }
    };

    const irParaSolicitacao = () => router.push({ name: "Solicitacao" });

    return {
      tipoPlano,
      nome,
      documento,
      nascimento,
      email,
      emailValido,
      senha,
      senhaValida,
      cep,
      endereco,
      numeroDaCasa,
      complemento,
      estado,
      cidade,
      pontoDeReferencia,
      termosUso,
      termosPrivacidade,
      estados,
      cidades,
      formValido,
      documentoValido,
      irParaSolicitacao,
      onSubmit,
      carregarCidades,
      buscarEnderecoPorCEP,
      validarSenha,
      validarEmail,
      usuarioId,
    };
  },
};
</script>
