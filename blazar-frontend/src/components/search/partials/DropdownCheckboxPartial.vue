<template>
  <div class="container">
    <div
      class="group"
      v-for="(group, id) in groups"
      :key="id"
      :class="{ 'show-all': groupId === id }"
    >
      <div
        class="title drop"
        :data-group-id="id"
        @click="showMoreItems"
        v-if="group.items.length > 5"
      >
        {{ group.title }}
      </div>

      <div class="title" v-else>
        {{ group.title }}
      </div>

      <ul class="min-items">
        <li v-for="(item, index) in group.items.slice(0, 5)" :key="index">
          <label class="label">
            <input
              type="checkbox"
              :name="group.name"
              :value="item.value"
              class="input-checkbox"
            />
            <span class="styled-checkbox"></span>
            <p class="describe">
              {{ item.describe }}
            </p>
            <span class="count">
              {{ item.amount }}
            </span>
          </label>
        </li>
      </ul>

      <ul class="rest-items">
        <li v-for="(item, index) in group.items.slice(5)" :key="index">
          <label class="label">
            <input
              type="checkbox"
              :name="group.name"
              :value="item.value"
              class="input-checkbox"
            />
            <span class="styled-checkbox"></span>
            <p class="describe">
              {{ item.describe }}
            </p>
            <span class="count">
              {{ item.amount }}
            </span>
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { ref } from 'vue';

type FiltersGroup = {
  name: string;
  title: string;
  items: Array<{
    value: string | number;
    describe: string;
    amount: number;
  }>;
};

const groupId = ref(-1);

function showMoreItems(mouseEvent: MouseEvent) {
  const currentGroupId = Number(
    (mouseEvent.target as HTMLDivElement).dataset.groupId
  );

  if (groupId.value === currentGroupId) {
    groupId.value = -1;
  } else if (currentGroupId >= 0) {
    groupId.value = currentGroupId;
  }
}

export default {
  props: {
    groups: {
      type: Array as PropType<Array<FiltersGroup>>,
      required: true,
    },
  },
  methods: {
    showMoreItems,
  },
  setup() {
    return {
      groupId,
    };
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  padding: 1.5rem 1rem;
  border-radius: 1rem;
  border: 1px solid var(--gray-300);
}

.container,
.title,
.min-items,
.rest-items {
  background-color: var(--white);
}

.group {
  position: relative;
  height: min-content;

  + .group {
    padding-top: 1rem;
    border-top: 1px solid var(--gray-200);
  }

  &.show-all {
    .title {
      &::after {
        transform: rotateZ(90deg);
      }
    }

    .rest-items {
      position: relative;
      z-index: 1;
      opacity: 1;
      transform: translateY(0);
      transition: opacity .21s ease-in;
    }
  }

  li {
    width: 100%;
  }
}

.title {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  font-weight: 600;

  &.drop {
    cursor: pointer;
  }

  &.drop::after {
    content: '';

    --size: 30px;
    width: var(--size);
    height: var(--size);
    background-image: url('/images/arrow-left.svg');
    background-size: 50% 50%;
    background-position: 50%;
    background-repeat: no-repeat;
    transform: rotateZ(-90deg);

    transition: transform 0.12s ease-out;
  }
}

.min-items {
  position: relative;
  z-index: 2;
}

.rest-items {
  position: absolute;
  z-index: -1050;
  opacity: 0;
  transform: translateY(-100%);

  transition: transform .12s ease-out;
}

.label {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  padding: 0.5rem 0;

  cursor: pointer;
  color: var(--muted);
  font-weight: 400;

  &:hover {
    color: var(--black);
  }

  .input-checkbox {
    position: absolute;
    z-index: -10;
    width: 0;
    height: 0;
    opacity: 0;

    &:checked ~ {
      .describe {
        color: var(--black);
      }

      .styled-checkbox {
        background-color: var(--primary);
      }
    }
  }

  .styled-checkbox {
    position: relative;
    display: flex;
    --size: 21px;
    width: var(--size);
    height: var(--size);
    border-radius: 5px;
    border: 1px solid var(--gray-300);
    background-color: var(--white);

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 5px;
      height: 10px;
      border: solid var(--white);
      border-width: 0 3px 3px 0;
      transform: translate(-50%, -50%) rotateZ(45deg);
    }
  }

  .count {
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    --size: 21px;
    width: var(--size);
    height: var(--size);
    border-radius: 70%;
    background-color: var(--primary);
    color: var(--white);
    font-size: 70%;
    font-weight: 600;
  }
}
</style>
