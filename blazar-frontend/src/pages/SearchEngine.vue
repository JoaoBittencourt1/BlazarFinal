<template>
  <q-page>
    <div class="row justify-evenly">
      <div class="q-pa-lg">
        <div class="q-pa-lg" style="position: relative">
          <q-select
            ref="qselectRef"
            filled
            :loading="qSelectIsLoading"
            v-model="multipleSearch"
            @update:model-value="clearFilter"
            dense
            use-input
            emit-value
            use-chips
            multiple
            input-debounce="0"
            label="O que você está procurando?"
            hint="Digite ao menos 3 caracteres"
            :options="options"
            @filter="searchCompound"
            @filter-abort="abortFilterFn"
            class="bg-white col"
            outlined
            style="padding-right: 40px"
          >
            <template #no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Nenhum resultado encontrado
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-btn
            flat
            round
            color="primary"
            icon="search"
            @click="multipleSearchClicked"
            style="
              position: absolute;
              right: 20px;
              top: 50%;
              transform: translateY(-75%);
            "
          />
        </div>

        <div class="q-pa-lg col">
          <q-chip
            outline
            v-model:selected="filterItems.molecule"
            color="primary"
            text-color="white"
            icon="science"
          >
            Moléculas
          </q-chip>
          <q-chip
            outline
            v-model:selected="filterItems.publications"
            color="orange"
            text-color="white"
            icon="newspaper"
          >
            Publicações
          </q-chip>
          <q-chip
            outline
            v-model:selected="filterItems.patents"
            color="red"
            text-color="white"
            icon="description"
          >
            Patentes
          </q-chip>
        </div>
      </div>
    </div>

    <div class="row justify-center" v-if="displayResults">
      <div class="col-12 q-pa-sm">
        <search-engine-container
          :category-selected="'publications'"
          :search-term="multipleSearchDataSelectedByButton"
          :free-search-term="freeMultipleSearchDataSelectedByButton"
          :molecules-filter-items-selected="
            moleculesFilterItemsSelectedByButton
          "
          :publications-filter-items-selected="
            publicationsFilterItemsSelectedByButton
          "
          :patents-filter-items-selected="patentsFilterItemsSelectedByButton"
          :selected-molecule-name="multipleSearchDataSelectedByButton"
          :compound-cid="compoundCid"
          :is-loading="searchEngineIsLoading"
        />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import type { Ref } from 'vue';
import axios from 'axios';
import SearchEngineContainer from '../components/search-engine/SearchEngineContainer.vue';
import { Notify } from 'quasar';

export default defineComponent({
  name: 'SearchEngine',
  components: { SearchEngineContainer },
  setup: () => {
    const filterItems = reactive({
      molecule: false,
      publications: false,
      patents: false,
    });
    const options: Ref = ref<string[]>();
    let defaultOptions: Ref = ref<string[]>();
    let qSelectIsLoading = ref(false);
    let searchEngineIsLoading: Ref = ref(false);
    let moleculesFilterItemsSelectedByButton = ref(false);
    let publicationsFilterItemsSelectedByButton = ref(false);
    let patentsFilterItemsSelectedByButton = ref(false);
    const pubChemAutocompleteURL = 'https://pubchem.ncbi.nlm.nih.gov/rest/';
    const compoundURL = 'autocomplete/compound/';
    const conceptsAndCidsURL = 'pug/concepts/name/JSON?name=';
    const search = ref(null);
    const multipleSearch = ref([]);
    const qselectRef: Ref = ref<string>();
    let multipleSearchDataSelectedByButton: Ref = ref([]);
    let freeMultipleSearchDataSelectedByButton: Ref = ref([]);
    let displayResults = ref(false);
    let molecules = ref(null);
    let compoundCid: Ref<number[]> = ref([]);
    let displaySearchEngineTabs = ref(false);

    const clearFilter = () => {
      if (qselectRef.value !== null) {
        qselectRef.value.updateInputValue('');
        qSelectIsLoading.value = false;
      }
    };

    const findCidByName = (value: string) => {
      searchEngineIsLoading.value = true;

      axios
        .get(
          pubChemAutocompleteURL +
            conceptsAndCidsURL +
            encodeURIComponent(value)
        )
        .then((response) => {
          let newCid;
          if (response.data.ConceptsAndCIDs.CID) {
            newCid = response.data.ConceptsAndCIDs.CID[0];
          } else {
            newCid = response.data.ConceptsAndCIDs.Concept[0].PreferredCID;
          }

          if (newCid && !compoundCid.value.includes(newCid)) {
            compoundCid.value.push(newCid);
          }
          displayResults.value = true;
          searchEngineIsLoading.value = false;
        })
        .catch((error) => {
          displayResults.value = false;
          console.log(error);
        });
    };

    const displayFreeSearchTerm = () => {
      displayResults.value = true;
      searchEngineIsLoading.value = false;
    };

    return {
      displayResults,
      search,
      multipleSearch,
      multipleSearchDataSelectedByButton,
      freeMultipleSearchDataSelectedByButton,
      molecules,
      qSelectIsLoading,
      searchEngineIsLoading,
      options,
      compoundCid,
      displaySearchEngineTabs,
      filterItems,
      moleculesFilterItemsSelectedByButton,
      publicationsFilterItemsSelectedByButton,
      patentsFilterItemsSelectedByButton,
      tab: ref('molecules'),
      qselectRef,
      clearFilter,
      multipleSearchClicked: async () => {
        if (
          !filterItems.molecule &&
          !filterItems.publications &&
          !filterItems.patents
        ) {
          Notify.create({
            message: 'Você deve selecionar ao menos um filtro!',
            color: 'orange',
          });
          return false;
        }

        searchEngineIsLoading.value = true;
        compoundCid.value = [];
        multipleSearchDataSelectedByButton.value = [];
        freeMultipleSearchDataSelectedByButton.value = [];

        multipleSearch.value.forEach((element: string) => {
          axios
            .get(pubChemAutocompleteURL + compoundURL + element)
            .then((response) => {
              defaultOptions.value = response.data.dictionary_terms.compound;

              if (defaultOptions.value.includes(element)) {
                multipleSearchDataSelectedByButton.value.push(element);
                findCidByName(element);
                searchEngineIsLoading.value = false;
              }

              if (!defaultOptions.value.includes(element)) {
                freeMultipleSearchDataSelectedByButton.value.push(element);
                displayFreeSearchTerm();
                searchEngineIsLoading.value = false;
              }
            });
        });

        moleculesFilterItemsSelectedByButton.value = filterItems.molecule;
        publicationsFilterItemsSelectedByButton.value =
          filterItems.publications;
        patentsFilterItemsSelectedByButton.value = filterItems.patents;
      },
      searchCompound: (
        val: string,
        update: (arg0: () => void) => void,
        abort: () => void
      ) => {
        //   //@todo put it into the env file
        if (val.length < 3) {
          abort();
          return;
        }
        qSelectIsLoading.value = true;
        update(async () => {
          axios
            .get(pubChemAutocompleteURL + compoundURL + val)
            .then((response) => {
              options.value = response.data.dictionary_terms.compound;
              options.value.unshift(val);
            });
        });
      },
      abortFilterFn() {
        // console.log('delayed filter aborted')
      },
    };
  },
});
</script>

<style scoped></style>
