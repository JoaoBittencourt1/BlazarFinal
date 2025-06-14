<template>
  <PaginationDetailsPartial :amount="amount" :length="filteredResults.length" />
  <ResultsLayout>
    <template #sidebar>
      <YearRangeFilterPartial
        :range-gap="1"
        :min-range="minRange"
        :max-range="maxRange"
      />

      <DropdownCheckboxPartial
        :groups="
          Array(5).fill({
            name: 'authors',
            title: 'Autores',
            items: Array(14).fill({
              value: 'author-1',
              describe: 'Ada Lovelace',
              amount: 1,
            }),
          })
        "
      />
    </template>

    <template #results>
      <PaginationGrid
        category="publications"
        :results="filteredResults"
        :update-page-amount-display="updatePageAmountDisplay"
      />
    </template>
  </ResultsLayout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { ResultsScheme } from '../pagination-engine/PaginationEngineType';
import PaginationDetailsPartial from '../partials/PaginationDetailsPartial.vue';
import ResultsLayout from '../layout/ResultsLayout.vue';
import PaginationGrid from '../pagination-engine/PaginationGrid.vue';
import YearRangeFilterPartial from '../partials/YearRangeFilterPartial.vue';
import DropdownCheckboxPartial from '../partials/DropdownCheckboxPartial.vue';
import { ref } from 'vue';

const minRange = 2000;
const maxRange = 2023;
const amount = ref(0);

function updatePageAmountDisplay(value: number) {
  amount.value = value;
}

export default {
  setup(props: { searchResults: ResultsScheme }) {
    const filteredResults = ref(props.searchResults);

    return {
      filteredResults,
      amount,
      minRange,
      maxRange,
    };
  },
  props: {
    searchResults: {
      type: Array as PropType<ResultsScheme>,
      required: true,
    },
  },
  methods: {
    updatePageAmountDisplay,
  },
  components: {
    DropdownCheckboxPartial,
    YearRangeFilterPartial,
    PaginationDetailsPartial,
    ResultsLayout,
    PaginationGrid,
  },
};
</script>
