<template>
  <div class="card">
    <a :href="link" class="linked-title">
      <h2 class="title">
        {{ title }}
      </h2>

      <q-tooltip
        anchor="top end"
        :offset="[-28, 28]"
        class="g-link-tooltip"
      >
        {{ link }}
      </q-tooltip>
    </a>

    <div class="row">
      <h4 class="middle-title">Autores</h4>

      <p class="authors">{{ authors.join(', ') }}</p>
    </div>

    <div class="row">
      <h4 class="middle-title">ID</h4>

      <p class="id" v-for="(id, index) in ids" :key="index">{{ id }}</p>
    </div>

    <div class="row">
      <h4 class="middle-title">Revista</h4>

      <p class="magazine">{{ magazine }}</p>
    </div>

    <div class="row">
      <h4 class="middle-title">Data de publicação</h4>

      <p class="published">{{ published }}</p>
    </div>

    <div class="row">
      <h4 class="middle-title">Palavras-chave</h4>

      <p class="keywords">
        {{ keywords.join('; ') }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    link: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    authors: {
      type: Array,
      required: true,
    },
    ids: {
      type: Array,
      required: true,
    },
    magazine: {
      type: String,
      required: true,
    },
    published: {
      type: String,
      required: true,
    },
    keywords: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import './CardComponent.scss';
</style>
