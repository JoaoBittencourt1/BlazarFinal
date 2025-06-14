<template>
  <div class="header">
    <div class="header-left">
      <button type="button" class="goback" @click="gobackWasClicked">
        <figure class="button-icon">
          <img src="../../../assets/images/search/small-left.svg" />
        </figure>
      </button>

      <h2 class="page-category">
        {{ category }}
      </h2>
    </div>

    <div class="header-right">
      <button type="button" class="button-action" @click="exportWasClicked">
        <figure class="button-icon">
          <img src="../../../assets/images/search/pdf.svg" />
        </figure>
        <span>
          Exportar como PDF
        </span>
      </button>

      <button type="button" class="button-action" @click="saveWasClicked">
        <figure class="button-icon">
          <img src="../../../assets/images/search/save-group.svg" />
        </figure>
        <span>
          Salvar
        </span>
      </button>
    </div>

    <a class="header-title" :href="linktTo" target="_blank" rel="noreferrer noopener">
      <h1>
        {{ title }}
      </h1>

      <q-tooltip
        anchor="bottom end"
        :offset="[-50, 0]"
        class="g-link-tooltip"
      >
        {{ linktTo }}
      </q-tooltip>
    </a>
  </div>
</template>

<script lang="ts">
import type { PropMouseEvent } from '../_types';

function gobackWasClicked(event: MouseEvent): void {
  console.log(event);
}

export default {
  props: {
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    linktTo: {
      type: String,
      required: true,
    },
    exportWasClicked: {
      type: Function as PropMouseEvent,
      required: true
    },
    saveWasClicked: {
      type: Function as PropMouseEvent,
      required: true,
    },
  },
  methods: {
    gobackWasClicked,
  },
};
</script>

<style lang="scss" scoped>
.header {
  & * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: space-between;
  gap: 2rem;
  padding: 1.5rem ;
  border-radius: 1.5rem;
  background-color: var(--white);

  .header-left,
  .header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .goback,
  .button-action {
    cursor: pointer;

    figure,
    span {
      pointer-events: none;
      user-select: none;
    }
  }

  .button-icon {
    pointer-events: none;
    user-select: none;

    img {
      width: var(--ic-size);
      height: var(--ic-size);
    }
  }

  .goback {
    --ic-size: 15px;
    padding: .75rem;
    border: none;
    border-radius: 50%;
    background-color: var(--secondary);
  }

  .page-category,
  .header-title {
    font-style: normal;
  }

  .page-category {
    cursor: default;
    user-select: all;
    font-size: 2rem;
    font-weight: 600;
  }

  .button-action {
    --ic-size: 25px;

    display: flex;
    align-items: center;
    padding: .5rem 1rem;
    border-radius: 20rem;
    border: 1px solid var(--secondary);
    background-color: var(--white);
  }

  .header-title {
    display: flex;
    align-items: center;
    gap: .5rem;
    width: 100%;
    color: black;
    text-decoration: none;

    h1 {
      width: 100%;
      font-size: 1.5rem;
      font-weight: 500;
      line-height: 1;
    }

    &::after {
      content: '';
      display: inline-block;
      --size: 50px;
      width: var(--size);
      height: var(--size);
      background-image: url('/images/link.svg');
    }
  }
}
</style>
