<template>
  <div v-if="!searchError">
    <q-card class="col-12 tab-with-margin">
      <q-card-section class="q-card__title bg-secondary">
        {{ selectedMoleculeName }}</q-card-section
      >
      <q-tabs v-model="tab" class="bg-secondary text-white" dense>
        <q-tab name="use-and-manufacturing" label="Utilização e Produção" />
        <q-tab name="names-and-identifiers" label="Nomenclatura" />
        <q-tab
          name="chemical-and-physical-properties"
          label="Características químicas e físicas"
        />
        <q-tab
          name="drug-and-medication-information"
          label="Informações médicas"
        />
        <q-tab
          name="pharmacology-and-biochemistry"
          label="Farmacologia e bioquímica"
        />
        <q-tab name="safety-and-hazards" label="Segurança e riscos" />
        <q-tab
          name="toxicological-information"
          label="Informações Toxicológicas"
        />
        <q-tab name="structures" label="Estrutura" />
        <q-tab name="clinical-trials" label="Fases de testes clínicos" />
        <q-tab name="image" label="Imagem" />
      </q-tabs>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="use-and-manufacturing">
          <use-and-manufactoring
            v-if="useAndManufacturingData"
            :data="useAndManufacturingData"
          />
        </q-tab-panel>
        <q-tab-panel name="names-and-identifiers">
          <names-and-identifiers
            v-if="namesAndIdentifiersData"
            :data="namesAndIdentifiersData"
          />
        </q-tab-panel>
        <q-tab-panel name="chemical-and-physical-properties">
          <chemical-and-physical-properties
            v-if="chemicalAndPhysicalPropertiesData"
            :data="chemicalAndPhysicalPropertiesData"
          />
        </q-tab-panel>
        <q-tab-panel name="drug-and-medication-information">
          <drug-and-medication-information
            v-if="drugAndMedicationInformationData"
            :data="drugAndMedicationInformationData"
          />
        </q-tab-panel>
        <q-tab-panel name="pharmacology-and-biochemistry">
          <pharmacology-and-biochemistry
            v-if="pharmacologyAndBiochemistryData"
            :data="pharmacologyAndBiochemistryData"
          />
        </q-tab-panel>
        <q-tab-panel name="safety-and-hazards">
          <safety-and-hazards
            v-if="safetyAndHazardsData"
            :data="safetyAndHazardsData"
          />
        </q-tab-panel>
        <q-tab-panel name="toxicological-information">
          <toxicological-information
            v-if="toxicologicalInformationData"
            :data="toxicologicalInformationData"
          />
        </q-tab-panel>
        <q-tab-panel name="structures"></q-tab-panel>
        <q-tab-panel name="pH/pKa"></q-tab-panel>
        <q-tab-panel name="clinical-trials"></q-tab-panel>
        <q-tab-panel name="image">
          <compound-image v-if="image" :data="image" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>

  <q-dialog v-model="searchError">
    <q-card>
      <q-card-section>
        <div class="text-h6">Alert</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        Erro na API do Pubchem, favor refazer a busca.
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import PubChemRecord from 'components/types/PubChemRecord';
import UseAndManufactoring from 'components/search-engine/tabs/molecules/UseAndManufactoring.vue';
import NamesAndIdentifiers from 'components/search-engine/tabs/molecules/NamesAndIdentifiers.vue';
import { dynamoDbClient } from 'boot/dynamodb.client';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import ChemicalAndPhysicalProperties from 'components/search-engine/tabs/molecules/ChemicalAndPhysicalProperties.vue';
import DrugAndMedicationInformation from 'components/search-engine/tabs/molecules/DrugAndMedicationInformation.vue';
import PharmacologyAndBiochemistry from 'components/search-engine/tabs/molecules/PharmacologyAndBiochemistry.vue';
import SafetyAndHazards from 'components/search-engine/tabs/molecules/SafetyAndHazards.vue';
import ToxicologicalInformation from 'components/search-engine/tabs/molecules/ToxicologicalInformation.vue';
import CompoundImage from 'components/search-engine/tabs/molecules/CompoundImage.vue';
// import AssociatedDisordersAndDiseases from 'components/search-engine/tabs/molecules/AssociatedDisordersAndDiseases.vue';

export default defineComponent({
  name: 'MoleculesTab',
  components: {
    CompoundImage,
    ToxicologicalInformation,
    SafetyAndHazards,
    PharmacologyAndBiochemistry,
    DrugAndMedicationInformation,
    ChemicalAndPhysicalProperties,
    UseAndManufactoring,
    NamesAndIdentifiers,
    // AssociatedDisordersAndDiseases
  },
  props: {
    compoundCid: {
      type: Number,
      required: true,
    },
    selectedMoleculeName: {
      type: Array<string>,
      required: true,
    },
  },
  setup(props) {
    let searchError = ref(false);
    let useAndManufacturingData = ref();
    let namesAndIdentifiersData = ref();
    let chemicalAndPhysicalPropertiesData = ref();
    let drugAndMedicationInformationData = ref();
    let pharmacologyAndBiochemistryData = ref();
    let safetyAndHazardsData = ref();
    let toxicologicalInformationData = ref();
    let image = ref<Blob>();
    let allData = {};
    let tab = ref('use-and-manufacturing');
    //@todo move it to pinia state
    const PUBCHEM_MAIN_URL = ref(
      'https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/compoundCid/JSON?heading=headingName'
    );
    const PUBCHEM_IMAGE_URL = ref(
      'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/compoundCid/PNG'
    );

    function getServiceURL(heading: string): string {
      if (heading === 'image') {
        return PUBCHEM_IMAGE_URL.value.replace(
          'compoundCid',
          props.compoundCid.toString()
        );
      }
      return PUBCHEM_MAIN_URL.value
        .replace('compoundCid', props.compoundCid.toString())
        .replace('headingName', heading);
    }

    function updateDynamoDB(data: Record<string, []>) {
      const dynamoDBParams = {
        TableName: 'compounds',
        Item: {
          compoundCid: props.compoundCid,
          ...data,
        },
        ConditionExpression: 'attribute_not_exists(compoundCid)',
      };

      dynamoDbClient
        .send(new PutCommand(dynamoDBParams))
        .then(() => {
          console.info('Saved to DynamoDB');
        })
        .catch((error) => {
          console.info('Compound is already on DB', error.name);
        });
    }

    async function callPubchemImage() {
      const serviceURL = getServiceURL('image');
      return await fetch(serviceURL).then((response) => response.blob());
    }

    async function callPubchemApi(heading: string): Promise<PubChemRecord> {
      const serviceURL = getServiceURL(heading);
      return await fetch(serviceURL)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((response) => response.Record)
        .catch(() => ({}));
    }

    async function searchAll() {
      useAndManufacturingData.value = await callPubchemApi(
        'Use+and+Manufacturing'
      );
      namesAndIdentifiersData.value = await callPubchemApi(
        'Names+and+Identifiers'
      );
      chemicalAndPhysicalPropertiesData.value = {
        molecularFormula: await callPubchemApi('molecular+formula'),
        molecularWeight: await callPubchemApi('molecular+weight'),
        meltingPoint: await callPubchemApi('melting+point'),
      };

      drugAndMedicationInformationData.value = {
        medicinalUse: await callPubchemApi('drug+and+medication+information'),
        drugClasses: await callPubchemApi('drug+classes'),
      };

      pharmacologyAndBiochemistryData.value = {
        cellularLocations: await callPubchemApi('cellular+locations'),
        tissueLocations: await callPubchemApi('tissue+locations'),
      };

      safetyAndHazardsData.value = await callPubchemApi('safety+and+hazards');

      toxicologicalInformationData.value = {
        hepatotoxicity: await callPubchemApi('hepatotoxicity'),
        acuteEffects: await callPubchemApi('acute+effects'),
      };

      image.value = await callPubchemImage();

      allData = {
        useAndManufacturing: useAndManufacturingData.value,
        namesAndIdentifiers: namesAndIdentifiersData.value,
        chemicalAndPhysicalProperties: chemicalAndPhysicalPropertiesData.value,
        drugAndMedicationInformation: drugAndMedicationInformationData.value,
        pharmacologyAndBiochemistry: pharmacologyAndBiochemistryData.value,
        safetyAndHazards: safetyAndHazardsData.value,
        toxicologicalInformation: toxicologicalInformationData.value,
      };

      updateDynamoDB(allData);
    }

    searchAll();
    return {
      tab,
      useAndManufacturingData,
      namesAndIdentifiersData,
      chemicalAndPhysicalPropertiesData,
      drugAndMedicationInformationData,
      pharmacologyAndBiochemistryData,
      safetyAndHazardsData,
      toxicologicalInformationData,
      image,
      searchError,
    };
  },
});
</script>

<style scoped>
.q-card__title {
  color: white;
  font-size: 24px;
  font-weight: bold;
  padding: 16px;
  margin-bottom: 1px;
  text-align: center;
}

.tab-with-margin {
  margin-bottom: 20px;
}
</style>
