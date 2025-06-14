<template>
  <div v-if="hepatotoxicity.length || acuteEffects.length">
    <div>
      <strong>Hepatotoxicidade</strong>
      <div v-for="(item, index) in hepatotoxicity" :key="index">
        <div v-for="(use, index) in item" :key="index">
          {{ use }}
          <q-separator class="q-ma-sm" />
        </div>
      </div>
    </div>
    <div>
      <strong>Efeitos agudos</strong>
      <div v-for="(item, index) in acuteEffects" :key="index">
        {{ item }}
      </div>
    </div>
  </div>
  <not-found v-else />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { extractMoleculeInformation } from 'components/search-engine/tabs/molecules/MoleculesService';
import NotFound from 'components/search-engine/tabs/molecules/NotFoundInformation.vue';
import Information from 'components/types/Information';

export default defineComponent({
  name: 'ToxicologicalInformation',
  components: { NotFound },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  setup: function (props) {
    let hepatotoxicity = ref([]);
    let acuteEffects = ref([]);
    let hepatotoxicityInformation = extractMoleculeInformation(
      props.data.hepatotoxicity
    );
    let acuteEffectsInformation = extractMoleculeInformation(
      props.data.acuteEffects
    );
    //@todo type
    hepatotoxicity.value = hepatotoxicityInformation.map(
      (information: Information) => {
        return information?.Value?.StringWithMarkup?.map((informationValue) => {
          return informationValue?.String;
        });
      }
    );

    //@todo type a.Record.Section[10].Section[0].Section[1].Information[0].Value.ExternalTableName

    acuteEffects.value = acuteEffectsInformation.map(
      (information: Information) => {
        return information?.Value?.ExternalTableName;
      }
    );

    return {
      acuteEffects,
      hepatotoxicity,
    };
  },
});
</script>

<style scoped></style>
