<template>
  <div class="pagina-solicitacao">
  <div class="container">
    <a id="textoSolicitacao"> A sua solicitação foi concluída!<br /> </a>
    <a id="textoEmail"> Você receberá um email com o link de teste. </a>

    <div class="loader-container">
      <div class="loader"></div>
      <a id="textoAguarde">Aguarde!!!</a>
    </div>

    <div class="voltar">
      <a href="/" id="textoVoltar">Voltar</a>
    </div>
  </div>
</div>
</template>

<script>
import "./Solicitacao.scss";

export default {
  name: "SolicitacaoVue",
  methods: {
    voltarParaInicio() {
      this.$router.push({ name: "Login" });
    },
  },
};
</script>

<style scoped></style>