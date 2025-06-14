<template>
  <p v-if="requirePayment">
    Essa pesquisa faz parte de um acervo pago.

    <a :href="url" target="_blank" rel="noreferrer noopener">
      Clique aqui para acessar o conteúdo original.

      <q-tooltip
        anchor="top middle"
        :offset="[0, 32]"
        class="g-link-tooltip"
      >
        {{ url }}
      </q-tooltip>
    </a>
  </p>

  <p v-else>
    Esta pesquisa tem acesso livre.

    <a :href="url" target="_blank" rel="noreferrer noopener">
      Clique aqui para ler o texto na íntegra.

      <q-tooltip
        anchor="top middle"
        :offset="[0, 32]"
        class="g-link-tooltip"
      >
        {{ url }}
      </q-tooltip>
    </a>
  </p>
</template>

<script lang="ts">
export default {
  props: {
    requirePayment: {
      type: Boolean,
    },
    url: {
      type: String,
      required: true,
    },
  },
};
</script>
