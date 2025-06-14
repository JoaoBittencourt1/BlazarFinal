<template>
  <div class="dashboard-wrapper">
    <UpdateAccountSidebar :activeTab="activeTab" @tab-change="(tab) => activeTab = tab" />

    <div class="dashboard-screen">
      <main class="account-content">
        <template v-if="activeTab === 'usuario'">
          <!-- Dados do Usuário -->
          <section class="account-section">
            <h2 class="section-title">Informações da Conta</h2>
            <div class="input-group">
              <label>Nome</label>
              <input type="text" v-model="fullName" />
            </div>
            <div class="input-grid grid-2">
              <div class="input-group">
                <label>CPF</label>
                <input type="text" v-model="cpf" />
              </div>
              <div class="input-group">
                <label>Data de nascimento</label>
                <input type="date" v-model="nascimento" />
              </div>
            </div>
          </section>

          <!-- Plano Atual -->
          <section class="account-section">
            <h2 class="section-title">Plano Atual</h2>
            <div class="input-group">
              <label>Plano Atual</label>
              <input type="text" v-model="userPlan" disabled />
            </div>
            <div class="input-group">
              <label>Descrição</label>
              <textarea v-model="planDescription" disabled></textarea>
            </div>
            <div class="input-group">
              <label>Validade</label>
              <input type="text" v-model="planValidity" disabled />
            </div>
          </section>

          <!-- Outros Dados -->
          <section class="account-section">
            <h2 class="section-title">Endereço</h2>
            <div class="input-grid grid-2">
              <div class="input-group">
                <label>CEP</label>
                <input type="text" v-model="cep" />
              </div>
              <div class="input-group">
                <label>Endereço</label>
                <input type="text" v-model="endereco" />
              </div>
            </div>
            <!-- Restante do Endereço -->
          </section>
        </template>

        <template v-else-if="activeTab === 'pagamento'">
          <!-- Dados de Pagamento -->
          <section class="account-section">
            <h2 class="section-title">Atualizar Método de Pagamento</h2>
            <div class="input-group">
              <label>Nome do Titular</label>
              <input type="text" v-model="cardOwnerName" />
            </div>
            <div class="input-group">
              <label>CPF do Titular</label>
              <input type="text" v-model="cpfTitular" />
            </div>
            <div class="input-group">
              <label>Número do Cartão</label>
              <input type="text" v-model="numeroCartao" placeholder="**** **** **** 1234" />
            </div>
            <div class="input-grid grid-2">
              <div class="input-group">
                <label>Validade</label>
                <input type="text" v-model="validadeCartao" placeholder="MM/AA" />
              </div>
              <div class="input-group">
                <label>CVV</label>
                <input type="text" v-model="cvvCartao" />
              </div>
            </div>
            <div class="botao-wrapper">
              <button class="botao-salvar" @click="salvarDadosPagamento">Salvar Dados do Cartão</button>
            </div>
          </section>
        </template>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Notify } from 'quasar';
import { supabase } from 'src/supabase';
import UpdateAccountSidebar from '../sidebar/UpdateAccount.vue';
import { useRouter } from 'vue-router';
import './AccountPage.scss';

const router = useRouter();
const activeTab = ref('usuario');
const loading = ref(false);
const fullName = ref('');
const email = ref('');
const cpf = ref('');
const nascimento = ref('');
const cep = ref('');
const endereco = ref('');
const numeroDaCasa = ref('');
const complemento = ref('');
const estado = ref('');
const cidade = ref('');
const pontoDeReferencia = ref('');
const isGoogleLinked = ref(false);

const cardOwnerName = ref('');
const cpfTitular = ref('');
const numeroCartao = ref(''); // com máscara
const validadeCartao = ref('');
const cvvCartao = ref('');

// Variáveis relacionadas ao plano
const userPlan = ref('Sem plano');
const planDescription = ref('');
const planValidity = ref('');

window.addEventListener('tab-change', (e: any) => {
  activeTab.value = e.detail;
  if (e.detail === 'pagamento') {
    loadPaymentData();
  }
});

onMounted(() => {
  loadUserData();
});

async function loadUserData() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  email.value = user.email;
  isGoogleLinked.value = user.app_metadata?.provider === 'google';

  try {
    const res = await fetch(`http://localhost:1500/api/premium/email/${encodeURIComponent(user.email)}`);
    const json = await res.json();
    if (json.success) {
      fullName.value = json.nome || '';
      cpf.value = json.cpf || '';
      nascimento.value = json.nascimento || '';
      cep.value = json.cep || '';
      endereco.value = json.endereco || '';
      numeroDaCasa.value = json.numeroDaCasa || '';
      complemento.value = json.complemento || '';
      estado.value = json.estado || '';
      cidade.value = json.cidade || '';
      pontoDeReferencia.value = json.pontoDeReferencia || '';

      // Definir o plano atual
      if (json.tipoPlano === 'pf') {
        userPlan.value = 'Pessoa Física';
        planDescription.value = 'Ideal para profissionais autônomos. Tenha acesso às nossas ferramentas com suporte exclusivo e relatórios simples para seu dia a dia.';
      } else if (json.tipoPlano === 'pj') {
        userPlan.value = 'Pessoa Jurídica';
        planDescription.value = 'Perfeito para empresas. Obtenha recursos avançados, múltiplos acessos e relatórios gerenciais completos para seu negócio.';
      } else {
        userPlan.value = 'Sem plano';
      }

      // Calcular validade (1 ano após a inscrição)
      const validade = new Date();
      validade.setFullYear(validade.getFullYear() + 1);
      planValidity.value = validade.toLocaleDateString();
    }
  } catch {
    Notify.create({ type: 'negative', message: 'Erro ao carregar dados do usuário' });
  }
}

async function loadPaymentData() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  try {
    const res = await fetch(`http://localhost:1500/api/premium/email/${encodeURIComponent(user.email)}`);
    const json = await res.json();
    if (json.success) {
      cardOwnerName.value = json.cardOwnerName || '';
      cpfTitular.value = json.cpfTitular || '';
      const last4 = json.numeroCartao?.slice(-4) || '1234';
      numeroCartao.value = `**** **** **** ${last4}`;
      validadeCartao.value = json.validadeCartao || '';
      cvvCartao.value = json.cvvCartao || '';
    }
  } catch {
    Notify.create({ type: 'negative', message: 'Erro ao carregar dados de pagamento' });
  }
}

async function salvarDadosPagamento() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  try {
    const res = await fetch(`http://localhost:1500/api/premium/email/${encodeURIComponent(user.email)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cardOwnerName: cardOwnerName.value,
        cpfTitular: cpfTitular.value,
        numeroCartao: numeroCartao.value.replace(/\D/g, '').slice(-4),
        validadeCartao: validadeCartao.value,
        cvvCartao: cvvCartao.value
      })
    });

    if (res.ok) {
      Notify.create({ type: 'positive', message: 'Dados de pagamento atualizados' });
    } else {
      Notify.create({ type: 'negative', message: 'Falha ao salvar os dados' });
    }
  } catch {
    Notify.create({ type: 'negative', message: 'Erro de rede ao salvar pagamento' });
  }
}

async function updateProfile() {
  loading.value = true;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  try {
    await fetch(`http://localhost:1500/api/premium/email/${encodeURIComponent(user.email)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: fullName.value,
        email: email.value,
        cpf: cpf.value,
        nascimento: nascimento.value,
        cep: cep.value,
        endereco: endereco.value,
        numeroDaCasa: numeroDaCasa.value,
        complemento: complemento.value,
        estado: estado.value,
        cidade: cidade.value,
        pontoDeReferencia: pontoDeReferencia.value
      })
    });
    Notify.create({ type: 'positive', message: 'Perfil atualizado' });
  } catch {
    Notify.create({ type: 'negative', message: 'Erro ao atualizar perfil' });
  } finally {
    loading.value = false;
  }
}

function redirectToPasswordRecovery() {
  window.location.href = 'http://localhost:8080/#/recovery-password';
}

function linkGoogleAccount() {
  supabase.auth.signInWithOAuth({ provider: 'google' });
}

onUnmounted(() => {
  const sidebar = document.querySelector('.floating-sidebar-container');
  if (sidebar) sidebar.remove();
});
</script>


