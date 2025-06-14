<template>
  <table class="table" :class="{ blueTitle, noTitle, purpleTitle }">
    <thead v-if="!noTitle">
      <tr class="table-row">
        <th class="table-cell table-title" v-for="(column, index) in columnsTitle" :key="index">
          {{ column }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr class="table-row" v-for="(cell) in totalRows" :key="cell">
        <td class="table-cell" v-for="(column, index) in columnsTitle" :key="index">
          <a :href="tableData[column][cell - 1].url" rel="noreferrer noopener" target="_blank" v-if="tableData[column][cell - 1]?.url">
            {{ tableData[column][cell - 1]?.content ?? '' }}

            <q-tooltip
              anchor="top middle"
              :offset="[0, 32]"
              class="g-link-tooltip"
            >
              {{ tableData[column][cell - 1].url }}
            </q-tooltip>
          </a>

          <span v-else>
            {{ tableData[column][cell - 1]?.content ?? '' }}
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import type { TablesProp, TablesColumn } from '../_types';
import { ref } from 'vue';

const columnsTitle = ref<Array<string>>([]);
const totalRows = ref(0);

function updateTableData(data: TablesColumn) {
  columnsTitle.value = Object.keys(data);

  columnsTitle.value.forEach((title) => {
    if (data[title].length > totalRows.value) {
      totalRows.value = data[title].length;
    }
  });
}

export default {
  setup(props: { tableData: TablesColumn }) {
    updateTableData(props.tableData);

    return {
      columnsTitle,
      totalRows,
    };
  },
  watch: {
    tableData(newValue: TablesColumn) {
      updateTableData(newValue);
    },
  },
  props: {
    tableData: {
      type: Object as TablesProp,
      required: true,
    },
    blueTitle: {
      type: Boolean,
    },
    noTitle: {
      type: Boolean,
    },
    purpleTitle: {
      type: Boolean,
    },
  },
};
</script>

<style lang="scss" scoped>
.table {
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  color: var(--black);

  &,
  .table-cell {
    border-collapse: collapse;
  }

  .table-cell {
    padding: .5rem;
    border: 2px solid black;
    background-color: var(--white);
    text-align: center;
    font-weight: 300;
  }

  .table-title {
    font-weight: 700;

    &::first-letter {
      text-transform: uppercase;
    }
  }

  &.blueTitle {
    .table-cell {
      border-color: var(--blue-400);
    }

    .table-title {
      background-color: var(--blue-500);
    }
  }

  &.noTitle {
    .table-row:nth-of-type(even) .table-cell {
      background-color: var(--blue-200);
    }

    .table-cell {
      font-weight: 500;
      border-color: var(--blue-500);
    }
  }

  &.purpleTitle {
    .table-cell {
      text-align: start;
    }

    .table-title {
      background-color: var(--purple-100);
    }
  }
}
</style>
