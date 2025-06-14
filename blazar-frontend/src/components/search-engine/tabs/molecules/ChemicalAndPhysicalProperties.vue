<template>
  <div
    v-if="
      molecularFormula.length || molecularWeight.length || meltingPoint.length
    "
  >
    <div>
      <div v-for="(item, index) in molecularFormula" :key="index">
        <div v-for="(mol, index) in item" :key="index">
          Molecular Formula: {{ mol }}
          <q-separator class="q-ma-sm" />
        </div>
      </div>

      <div v-for="(item, index) in molecularWeight" :key="index">
        <div v-for="(mol, index) in item" :key="index">
          Molecular Weight: {{ mol }}
          <q-separator class="q-ma-sm" />
        </div>
      </div>

      <div v-for="(item, index) in meltingPoint" :key="index">
        <div v-for="(mol, index) in item" :key="index">
          Melting Point: {{ mol }}
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
  name: 'ChemicalAndPhysicalProperties',
  components: { NotFound },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  setup: function (props) {
    let molecularFormula = ref([]);
    let molecularWeight = ref([]);
    let meltingPoint = ref([]);

    let molecularFormulaData = extractMoleculeInformation(
      props.data.molecularFormula
    );
    let molecularWeightData = extractMoleculeInformation(
      props.data.molecularWeight
    );
    let meltingPointData = extractMoleculeInformation(props.data.meltingPoint);

    //@todo type  information?.Value?.StringWithMarkup informationValue
    molecularWeight.value = molecularWeightData.map(
      (information: Information) => {
        return information?.Value?.StringWithMarkup?.map((informationValue) => {
          return informationValue?.String;
        });
      }
    );

    //@todo type
    meltingPoint.value = meltingPointData.map((information: Information) => {
      return information?.Value?.StringWithMarkup?.map((informationValue) => {
        return informationValue?.String;
      });
    });

    //@todo type
    molecularFormula.value = molecularFormulaData.map(
      (information: Information) => {
        return information?.Value?.StringWithMarkup?.map((informationValue) => {
          return informationValue?.String;
        });
      }
    );

    return {
      molecularFormula,
      molecularWeight,
      meltingPoint,
    };
  },
});
</script>

<style scoped></style>
