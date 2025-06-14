<template>
  <div class="pagina-obrigado">
  <div class="container">
    <h1>Obrigado!</h1>
    <p>Seu pagamento foi concluído com sucesso!</p>
    <a href="/" class="btn">Voltar para a Página Inicial</a>
  </div>
</div>
</template>

<script>
import "./TeladeObrigado.scss";

export default {
  name: "TeladeObrigado",
  setup() {
    console.log("Renderizando Tela de Obrigado");
    return {};
  },
};
</script>