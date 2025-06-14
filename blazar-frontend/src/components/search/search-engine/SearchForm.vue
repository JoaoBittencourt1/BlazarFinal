<template>
  <section class="search-container">
    <form
      ref="formRef"
      class="search-form"
      @submit.prevent="handleSubmit"
      novalidate
    >
      <label class="search-label" for="search-engine">
        <figure class="search-icon">
          <img src="../../../assets/images/search/search-small.svg" />
        </figure>
      </label>

      <label class="search-box">
        <input
          id="search-engine"
          class="search-input"
          type="search"
          name="search"
          autocomplete="off"
          autosave="off"
          placeholder="Digite pelo menos 3 caracteres"
          minlength="3"
          required
          @input.prevent="requestTermsOptions"
        />

        <div class="invalid-feedback">Digite pelo menos 3 caracteres</div>

        <ul class="search-select">
          <li
            v-for="(term, index) in listOfTermsToSelect"
            :key="index"
            @click="selectTerm(term)"
          >
            {{ term }}
          </li>
          <li class="loading-options" v-if="isLoadingOptions">
            <figure class="loading-figure">
              <img src="../../../assets/images/search/circle-loading.svg" />
              <figcaption>Buscando sugestões...</figcaption>
            </figure>
          </li>
        </ul>
      </label>

      <label
        class="checkbox-label"
        v-for="({ value, describe, selected }, index) in headerOptions"
        :key="index"
      >
        <input
          type="radio"
          name="option"
          :value="value"
          :checked="selected"
          class="checkbox-input"
        />

        <span class="checkbox-button">
          {{ describe }}
        </span>
      </label>

      <button type="submit" class="submit-button">
        <figure class="submit-icon">
          <img src="../../../assets/images/search/search-detail.svg" />
        </figure>

        <span> pesquisar </span>
      </button>
    </form>
  </section>
</template>

<script lang="ts">
import type { HeaderOption, SearchState } from '../_types';
import type { PropType } from 'vue';
import { ref } from 'vue';
import axios from 'axios';
import { Notify } from 'quasar';
import { useSharedState } from 'src/stores/useSharedState';

const sharedStore = useSharedState();

const pubChemAutocompleteURL = 'https://pubchem.ncbi.nlm.nih.gov/rest/';
const compoundURL = 'autocomplete/compound/';
const conceptsAndCidsURL = 'pug/concepts/name/JSON?name=';

const mainSearchURL = pubChemAutocompleteURL.concat(compoundURL);
const searchCidsURL = pubChemAutocompleteURL.concat(conceptsAndCidsURL);

const intervalForRequest = ref<ReturnType<typeof setTimeout>>();
const formRef = ref<HTMLFormElement | null>(null);
const isLoadingOptions = ref(true);
const searchTermsSelected = ref<Set<string>>(new Set());
const listOfTermsToSelect = ref<Set<string>>(new Set());
const headerOptions = ref<Array<HeaderOption>>([
  {
    value: 'molecules',
    describe: 'Moléculas',
    selected: false,
  },
  {
    value: 'publications',
    describe: 'Publicações',
    selected: true,
  },
  {
    value: 'patents',
    describe: 'Patentes',
    selected: false,
  },
  {
    value: 'clinicalTrials',
    describe: 'Testes clínicos',
    selected: false,
  },
]);

function selectTerm(term: string) {
  const form = formRef.value as HTMLFormElement;
  form.search.value = term;
  form.search.classList.add('term-was-selected');
}

function warningNotify(message: string) {
  Notify.create({
    type: 'warning',
    message: message || 'Tente novamente',
    timeout: sharedStore.notify.timeout,
    actions: [
      {
        icon: 'close',
        color: 'black',
        round: true,
      },
    ],
  });
}

async function findCidByName(value: string, searchState: SearchState) {
  const encodedValue = encodeURIComponent(value);

  await axios
    .get(searchCidsURL.concat(encodedValue))
    .then((response) => {
      const conceptsAndCids = response.data.ConceptsAndCIDs;
      let cid: number;

      if (conceptsAndCids.CID) {
        cid = conceptsAndCids.CID[0];
      } else {
        cid = conceptsAndCids.Concept[0].PreferredCID;
      }

      if (cid) {
        searchState.compoundCid.add(cid);
      }
    });
}

async function fetcher(element: string, searchState: SearchState) {
  await axios
    .get(mainSearchURL.concat(element))
    .then(async (filterResponse) => {
      const dictionary = filterResponse.data.dictionary_terms;

      if (!dictionary || !dictionary.compound) {
        return console.log('Nada encontrado para:', element);
      }

      const optionsFromSearch = dictionary.compound;

      if (optionsFromSearch.includes(element)) {
        searchState.multipleSearchData.add(element);
        await findCidByName(element, searchState);
      } else {
        searchState.freeSearchData.add(element);
      }
    });
}

async function searchOnSubmit(searchState: SearchState) {
  searchState.multipleSearchData.clear();
  searchState.freeSearchData.clear();
  searchState.isLoading = true;

  await fetcher(searchState.termOfSearch, searchState);

  searchState.isLoading = false;
}

function handleSubmit(formEvent: Event) {
  const form = formEvent.target as HTMLFormElement;
  const searchValue = form.search.value;

  if (!searchValue || searchValue.length < 3) {
    return form.classList.add('was-validate');
  }

  form.classList.remove('was-validate');
  form.search.classList.add('term-was-selected');

  const searchType = form.option.value;

  if (!searchType) {
    return warningNotify('Selecione uma categoria');
  }

  this.searchState.termOfSearch = searchValue;
  this.searchState.categorySelected = searchType;

  searchOnSubmit(this.searchState);
}

function executeOptionsSearch(value: string) {
  axios
    .get(mainSearchURL.concat(value))
    .then((response) => {
      if (!response.data.dictionary_terms) return;

      const options = response.data.dictionary_terms.compound;

      options.forEach((option: string) => {
        listOfTermsToSelect.value.add(option);
      });
    })
    .finally(() => {
      isLoadingOptions.value = false;
    });
}

function requestTermsOptions(inputEvent: Event) {
  const input = inputEvent.target as HTMLInputElement;

  clearTimeout(intervalForRequest.value);

  if (!input.checkValidity()) return;
  formRef.value?.search.classList.remove('term-was-selected');

  const value = input.value;

  isLoadingOptions.value = true;
  listOfTermsToSelect.value.clear();
  listOfTermsToSelect.value.add(value);

  intervalForRequest.value = setTimeout(() => {
    executeOptionsSearch(value);
  }, sharedStore.searchEngine.searchDelay);
}

export default {
  setup() {
    formRef.value = null;
    isLoadingOptions.value = true;
    searchTermsSelected.value.clear();
    listOfTermsToSelect.value.clear();

    return {
      searchTermsSelected,
      headerOptions,
      listOfTermsToSelect,
      isLoadingOptions,
      formRef,
    };
  },
  props: {
    searchStateProps: {
      type: Object as PropType<SearchState>,
      required: true,
      default() {},
    },
  },
  data() {
    return {
      searchState: this.searchStateProps as SearchState,
    };
  },
  methods: {
    handleSubmit,
    selectTerm,
    requestTermsOptions,
  },
};
</script>

<style lang="scss" scoped>
@import './SearchForm.scss';
</style>
