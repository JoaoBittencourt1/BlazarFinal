<template>
  <div v-if="!items.length">Nenhum resultado para exibir</div>

  <div class="results" v-else-if="category === 'publications'">
    <CardPublication
      v-for="(data, index) in items"
      :key="index"
      :link="data.link"
      :title="data.title"
      :authors="data.authors"
      :ids="data.ids"
      :magazine="data.magazine"
      :published="data.published"
      :keywords="data.keywords"
    />
  </div>

  <br />

  <div class="pagination" @click="handlePagination">
    <div
      class="page"
      v-for="page in pageAmount"
      :class="{ current: page == currentPage }"
      :data-page="page"
      :key="page"
    >
      {{ page }}
    </div>
  </div>
</template>

<script lang="ts">
import type {
  CategoryProp,
  ResultsProp,
  ResultsScheme,
  PageProps,
} from './PaginationEngineType';
import CardPublication from './CardPublication.vue';
import { ref } from 'vue';

const rowsPerPage = ref(2);
const itemsPerPage = ref(rowsPerPage.value * 2);
const pageAmount = ref(0);
const currentPage = ref(1);
const items = ref<ResultsScheme>([]);

function handlePagination(mouseEvent: MouseEvent) {
  const target = mouseEvent.target as HTMLElement;
  const page = target.dataset.page && Number(target.dataset.page);

  if (!page) return;

  currentPage.value = page;

  calcPages(this);
}

function calcPages(props: PageProps) {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;

  items.value = props.results.slice(start, end);
  pageAmount.value = Math.ceil(props.results.length / itemsPerPage.value);

  props.updatePageAmountDisplay(items.value.length);

  document.getElementById('results-section')?.scrollTo(0, 0);
}

function updateItemsPerPage(width: number, _this: PageProps): void {
  const medium = 1720;
  const large = 2200;
  const extraLarge = 2655;

  if (width < medium) {
    itemsPerPage.value = rowsPerPage.value * 2;
  } else if (width >= medium && width < large) {
    itemsPerPage.value = rowsPerPage.value * 3;
  } else if (width >= large && width < extraLarge) {
    itemsPerPage.value = rowsPerPage.value * 4;
  } else if (width >= extraLarge) {
    itemsPerPage.value = rowsPerPage.value * 5;
  }

  calcPages(_this);
}

function onWindowResize(_this: PageProps) {
  const width = window.innerWidth;
  updateItemsPerPage(width, _this);
}

export default {
  props: {
    category: {
      type: String as CategoryProp,
      required: true,
    },
    results: {
      type: Array as ResultsProp,
      required: true,
    },
    updatePageAmountDisplay: {
      type: Function,
      required: true,
    },
  },
  methods: {
    handlePagination,
    onWindowResize,
  },
  components: {
    CardPublication,
  },
  setup(props: PageProps) {
    calcPages(props);

    return {
      currentPage,
      pageAmount,
      items,
    };
  },
  mounted() {
    window.addEventListener('resize', () => this.onWindowResize(this));
    updateItemsPerPage(window.innerWidth, this);
  },
  unmounted() {
    window.removeEventListener('resize', () => this.onWindowResize(this));
  },
};
</script>

<style lang="scss" scoped>
@import './PaginationGrid.scss';
</style>
