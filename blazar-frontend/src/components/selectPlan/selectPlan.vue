<template>
  <div class="plan-selection-wrapper">
    <div class="plan-selection-container">
      <h1 class="plan-title">Escolha seu plano</h1>

      <div class="plan-cards">
        <div class="plan-card">
          <h2>Pessoa Física</h2>
          <p>Ideal para profissionais autônomos. Tenha acesso às nossas ferramentas com suporte exclusivo e relatórios simples para seu dia a dia.</p>
          <button @click="selecionarPlano('pf')">Selecionar</button>
        </div>

        <div class="plan-card">
          <h2>Pessoa Jurídica</h2>
          <p>Perfeito para empresas. Obtenha recursos avançados, múltiplos acessos e relatórios gerenciais completos para seu negócio.</p>
          <button @click="selecionarPlano('pj')">Selecionar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function selecionarPlano(tipo) {
  router.push({ path: '/premium', query: { plano: tipo } })
}
</script>

<style>
@import './selectPlan.scss';
</style>
