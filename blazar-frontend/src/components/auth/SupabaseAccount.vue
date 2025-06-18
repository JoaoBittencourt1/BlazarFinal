<template>
  <div class="dashboard-wrapper">
    <UpdateAccountSidebar :activeTab="activeTab" @tab-change="changeTab" />

    <div class="dashboard-screen">
      <main class="account-content">
        <template v-if="activeTab === 'usuario'">
          <section class="account-section">
            <h2 class="section-title">Informações da Conta</h2>
            <div class="input-group">
              <label>{{ tipoPlano === 'pf' ? 'Nome' : 'Razão Social' }}</label>
              <input type="text" v-model="fullName" />
            </div>
            <div class="input-grid grid-2">
              <div class="input-group">
                <label>{{ tipoPlano === 'pf' ? 'CPF' : 'CNPJ' }}</label>
                <input type="text" v-model="cpf" />
              </div>
              <div class="input-group" v-if="tipoPlano === 'pf'">
                <label>Data de nascimento</label>
                <input type="date" v-model="nascimento" />
              </div>
            </div>
          </section>

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
            <div class="input-grid grid-2">
              <div class="input-group">
                <label>Número</label>
                <input type="text" v-model="numeroDaCasa" />
              </div>
              <div class="input-group">
                <label>Complemento</label>
                <input type="text" v-model="complemento" />
              </div>
            </div>
            <div class="input-grid grid-2">
              <div class="input-group">
                <label>Estado</label>
                <input type="text" v-model="estado" />
              </div>
              <div class="input-group">
                <label>Cidade</label>
                <input type="text" v-model="cidade" />
              </div>
            </div>
            <div class="input-group">
              <label>Ponto de Referência</label>
              <input type="text" v-model="pontoDeReferencia" />
            </div>
          </section>

          <section class="account-section">
            <h2 class="section-title">Dados de Login</h2>
            <div class="input-group">
              <label>Email</label>
              <input type="email" v-model="email" disabled />
            </div>
            <div class="botao-wrapper space-between">
              <button class="link-button" @click="redirectToPasswordRecovery">Alterar senha</button>
              <button class="botao-salvar" @click="updateProfile" :disabled="loading">Salvar Alterações</button>
            </div>
          </section>
        </template>

        <template v-else-if="activeTab === 'pagamento'">
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

        <template v-else-if="activeTab === 'plano'">
          <section class="account-section">
            <h2 class="section-title">Seu Plano Atual</h2>
            <div class="plano-box">
              <h3>{{ tipoPlano === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica' }}</h3>
              <p v-if="tipoPlano === 'pf'">
                Ideal para profissionais autônomos. Tenha acesso às nossas ferramentas com suporte exclusivo e relatórios simples para seu dia a dia.
              </p>
              <p v-else>
                Perfeito para empresas. Obtenha recursos avançados, múltiplos acessos e relatórios gerenciais completos para seu negócio.
              </p>
              <button class="botao-salvar" @click="trocarPlano">
                Trocar para {{ tipoPlano === 'pf' ? 'Pessoa Jurídica' : 'Pessoa Física' }}
              </button>
            </div>
          </section>
        </template>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Notify } from 'quasar'
import { supabase } from 'src/supabase'
import UpdateAccountSidebar from '../sidebar/UpdateAccount.vue'
import { useRouter } from 'vue-router'
import "./AccountPage.scss"

const router = useRouter()
const activeTab = ref('usuario')
const loading = ref(false)

const fullName = ref('')
const email = ref('')
const cpf = ref('')
const nascimento = ref('')
const cep = ref('')
const endereco = ref('')
const numeroDaCasa = ref('')
const complemento = ref('')
const estado = ref('')
const cidade = ref('')
const pontoDeReferencia = ref('')
const cardOwnerName = ref('')
const cpfTitular = ref('')
const numeroCartao = ref('')
const validadeCartao = ref('')
const cvvCartao = ref('')
const tipoPlano = ref('pj')
const userId = ref('')

function changeTab(tab: string) {
  activeTab.value = tab
  if (tab === 'usuario') loadUserData()
  else if (tab === 'pagamento') loadPaymentData()
  else if (tab === 'plano') loadPlanData()
}

async function loadUserData() {
  loading.value = true
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      email.value = user.email
      const res = await fetch(`http://localhost:1500/api/premium/email/${encodeURIComponent(user.email)}`)
      const json = await res.json()
      if (json.success) {
        fullName.value = json.nome || ''
        cpf.value = json.cpf || ''
        nascimento.value = json.nascimento || ''
        cep.value = json.cep || ''
        endereco.value = json.endereco || ''
        numeroDaCasa.value = json.numeroDaCasa || ''
        complemento.value = json.complemento || ''
        estado.value = json.estado || ''
        cidade.value = json.cidade || ''
        pontoDeReferencia.value = json.pontoDeReferencia || ''
        tipoPlano.value = json.tipoPlano || 'pj'
        userId.value = json.id
      }
    }
  } finally {
    loading.value = false
  }
}

async function loadPaymentData() {
  loading.value = true
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const res = await fetch(`http://localhost:1500/api/premium/email/${encodeURIComponent(user.email)}`)
      const json = await res.json()
      if (json.success) {
        cardOwnerName.value = json.cardOwnerName || ''
        cpfTitular.value = json.cpfTitular || ''
        numeroCartao.value = `**** **** **** ${json.cardLast4 || '0000'}`
        validadeCartao.value = json.cardExpiry || ''
        cvvCartao.value = ''
      }
    }
  } finally {
    loading.value = false
  }
}

async function loadPlanData() {
  loading.value = true
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const res = await fetch(`http://localhost:1500/api/premium/email/${encodeURIComponent(user.email)}`)
      const json = await res.json()
      if (json.success) {
        tipoPlano.value = json.tipoPlano || 'pj'
        userId.value = json.id
      }
    }
  } finally {
    loading.value = false
  }
}

async function updateProfile() {
  loading.value = true
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const res = await fetch(`http://localhost:1500/api/premium/email/${encodeURIComponent(user.email)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: fullName.value,
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
      })
      if (res.ok) Notify.create({ type: 'positive', message: 'Perfil salvo!' })
      else Notify.create({ type: 'negative', message: 'Erro ao salvar perfil' })
    }
  } finally {
    loading.value = false
  }
}

async function salvarDadosPagamento() {
  loading.value = true
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
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
      })
      if (res.ok) Notify.create({ type: 'positive', message: 'Pagamento salvo!' })
      else Notify.create({ type: 'negative', message: 'Erro ao salvar pagamento' })
    }
  } finally {
    loading.value = false
  }
}

async function trocarPlano() {
  const novoPlano = tipoPlano.value === 'pf' ? 'pj' : 'pf'
  const res = await fetch(`http://localhost:1500/api/premium/${userId.value}/alterar-plano`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tipoPlano: novoPlano })
  })
  if (res.ok) {
    router.push({ path: `/pagamento/${userId.value}`, query: { plano: novoPlano } })
  } else {
    Notify.create({ type: 'negative', message: 'Erro ao alterar plano' })
  }
}

onMounted(loadUserData)
onUnmounted(() => {
  const sidebar = document.querySelector('.floating-sidebar-container')
  if (sidebar) sidebar.remove()
})
window.addEventListener('tab-change', (e: any) => {
  changeTab(e.detail)
})
</script>

<style scoped>
/* Seu CSS opcional aqui */
</style>
