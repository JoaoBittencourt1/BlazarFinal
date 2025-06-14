<template>
  <div v-if="drugClasses.length || liverToxSummary.length">
    <div>
      <strong>Uso Medicinal</strong>
      <div v-for="(item, index) in liverToxSummary" :key="index">
        <div v-for="(use, index) in item" :key="index">
          {{ use }}
          <q-separator class="q-ma-sm" />
        </div>
      </div>
    </div>
    <div>
      <strong>Classe de Medicamentos</strong>
      <div v-for="(item, index) in drugClasses" :key="index">
        <div v-for="(use, index) in item" :key="index">
          {{ use }}
          <q-separator class="q-ma-sm" />
        </div>
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
  name: 'DrugAndMedicationInformation',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  components: { NotFound },
  setup: function (props) {
    let liverToxSummary = ref([]);
    let drugClasses = ref([]);
    let liverToxSummaryInformation = extractMoleculeInformation(
      props.data.medicinalUse
    );
    let drugClassInformation = extractMoleculeInformation(
      props.data.drugClasses
    );
    //@todo type
    liverToxSummary.value = liverToxSummaryInformation.map(
      (information: Information) => {
        return information?.Value?.StringWithMarkup?.map((informationValue) => {
          return informationValue?.String;
        });
      }
    );

    //@todo type
    drugClasses.value = drugClassInformation.map((information: Information) => {
      return information?.Value?.StringWithMarkup?.map((informationValue) => {
        return informationValue?.String;
      });
    });

    //@todo create type.
    return {
      liverToxSummary,
      drugClasses,
    };
  },
});
</script>

<style scoped></style>
