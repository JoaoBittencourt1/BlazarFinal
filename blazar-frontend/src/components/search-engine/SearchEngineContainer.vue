<template>
  <q-tab-panel name="molecules" v-if="categorySelected === 'molecules'">
    <!-- <molecules-tab v-for="(cid, index) in compoundCid" :key="index" :compound-cid="cid" :selected-molecule-name="selectedMoleculeName[index]" /> -->
    <u>A "molecules-tab" ESTÁ OCULTADA</u>
  </q-tab-panel>

  <q-tab-panel name="publications" v-if="categorySelected === 'publications'">
    <publications-tab :search-term="searchTerm"/>
  </q-tab-panel>

  <q-tab-panel name="patents" v-if="categorySelected === 'patents'">
    <div class="text-h6">Patentes</div>
    Mussum Ipsum, cacilds vidis litro abertis. Interagi no mé, cursus quis, vehicula ac nisi.Si num tem leite então bota uma pinga aí cumpadi!Suco de cevadiss deixa as pessoas mais interessantis.Cevadis im ampola pa arma uma pindureta.
  </q-tab-panel>
</template>

<script lang="ts">
import type { Categories } from '../search/_types';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import MoleculesTab from 'components/search-engine/tabs/MoleculesTab.vue';
import PublicationsTab from './tabs/PublicationsTab.vue';

export default defineComponent({
  name: 'SearchEngineContainer',
  components: {
    // MoleculesTab,
    PublicationsTab
  },
  props: {
    categorySelected: {
      type: String as PropType<Categories>,
      required: true,
    },
    searchTerm: {
      type: <any>[],
      required: true,
    },
    freeSearchTerm: {
      type: Array<string>,
      required: false,
      default() {
        return [];
      },
    },
    compoundCid: {
      type: Array<number>,
      required: false,
      default() {
        return [];
      },
    },
    selectedMoleculeName: {
      type: Array<string>,
      required: true,
    },
  },
});
</script>
