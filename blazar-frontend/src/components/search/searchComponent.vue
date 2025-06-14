<template>
  <div id="dashboard-search" class="dashboard-search">
    <div class="dashboard-content">
      <SearchEngine :search-state-props="searchState" />

      <main class="query-response">
        <LoadingScreen v-if="searchState.isLoading" />

        <PublicationResults
          v-else-if="
            searchState.categorySelected === 'publications' &&
            !searchState.isLoading &&
            resultsForExample.length
          "
          :search-results="resultsForExample"
        />

        <WaitSearch v-else />
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import type { SearchState } from './_types';
import { ref } from 'vue';
import SearchEngine from './search-engine/SearchForm.vue';
import LoadingScreen from './partials/LoadingPartial.vue';
import WaitSearch from './partials/WaitResultsPartial.vue';
import PublicationResults from './publication/PublicationResults.vue';

const searchState = ref<SearchState>({} as SearchState);

const resultsForExample = Array(60).fill({
  link: '#link-to',
  title: 'title',
  authors: ['Authores'],
  ids: [123, 456, 789],
  magazine: 'revista',
  published: '02/01/1200',
  keywords: ['palavra', 'chave'],
});

export default {
  setup() {
    searchState.value = {
      termOfSearch: '',
      isLoading: false,
      categorySelected: 'molecules',
      compoundCid: new Set<number>(),
      multipleSearchData: new Set<string>(),
      freeSearchData: new Set<string>(),
    };

    return {
      searchState,
      resultsForExample,
    };
  },
  components: {
    SearchEngine,
    WaitSearch,
    LoadingScreen,
    PublicationResults,
  },
};
</script>

<style lang="scss" scoped>
.dashboard-search {
  &,
  & * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  width: 100%;
  max-width: 100%;
  max-height: 100%;
  background-color: var(--white);
}

.dashboard-content {
  --margin: 1rem;
  margin: 0 var(--margin);
  padding: 1.5rem;
  max-height: 100vh;
}

.query-response {
  width: 100%;
}

@media (max-width: 1366px) {
  .query-response {
    min-height: 500px;
  }
}
</style>
