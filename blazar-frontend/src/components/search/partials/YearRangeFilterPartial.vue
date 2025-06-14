<template>
  <div class="container">
    <h4 class="title">Ano de publicação</h4>
    <div
      class="slider-container"
      draggable="false"
      @mouseup="disableRange"
      @mousemove="onMouseMove"
    >
      <div ref="sliderRef" class="slider" draggable="false">
        <input
          ref="inputMinRef"
          type="range"
          class="input"
          name="min"
          :min="minRange"
          :max="maxRange"
          v-model="inputMinValue"
          :step="1"
        />
        <input
          ref="inputMaxRef"
          type="range"
          class="input"
          name="max"
          :min="minRange"
          :max="maxRange"
          v-model="inputMaxValue"
          :step="1"
        />

        <div class="bar" draggable="false"></div>
        <div ref="progressBarRef" class="progress" draggable="false"></div>
        <div
          ref="buttonLeftRef"
          class="left"
          draggable="false"
          @mousedown="() => enableRange('left')"
        ></div>
        <div
          ref="buttonRightRef"
          class="right"
          draggable="false"
          @mousedown="() => enableRange('right')"
        ></div>
      </div>

      <div class="display-range">
        <span :class="{ 'hidden-value': hiddenLeftStatic }">{{ minRange }}</span>
        <span ref="displayMinYear" class="display-year">{{
          inputMinValue
        }}</span>
        <span ref="displayMaxYear" class="display-year">{{
          inputMaxValue
        }}</span>
        <span :class="{ 'hidden-value': hiddenRightStatic }">{{ maxRange }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

type Props = {
  minRange: number;
  maxRange: number;
  rangeGap: number;
};
type Side = 'right' | 'left' | null;

const props = defineProps<Props>();
const sliderRef = ref<HTMLDivElement>();
const buttonLeftRef = ref<HTMLDivElement>();
const buttonRightRef = ref<HTMLDivElement>();
const progressBarRef = ref<HTMLDivElement>();
const displayMinYear = ref<HTMLDivElement>();
const displayMaxYear = ref<HTMLDivElement>();
const inputMinValue = ref(props.minRange);
const inputMaxValue = ref(props.maxRange);
const realRange = props.maxRange - props.minRange;
const side = ref<Side>(null);
const hiddenLeftStatic = ref(true);
const hiddenRightStatic = ref(true);

function enableRange(selectedSide: Side) {
  side.value = selectedSide;
  sliderRef.value?.classList.add('enable');
}

function disableRange() {
  side.value = null;
  sliderRef.value?.classList.remove('enable');
}

function calcProgressDistance(value: number) {
  const buttonDistance = (value - props.minRange) / (realRange / 100);
  return buttonDistance;
}

function updateRightInput(value: number) {
  if (
    value < inputMaxValue.value &&
    value - inputMinValue.value < props.rangeGap
  ) {
    return;
  }

  inputMaxValue.value = value;
}

function updateLeftInput(value: number) {
  if (
    value > inputMinValue.value &&
    inputMaxValue.value - value < props.rangeGap
  ) {
    inputMinValue.value = inputMaxValue.value - props.rangeGap;

    return;
  }

  inputMinValue.value = value;
}

function updateProgressBar() {
  if (!buttonLeftRef.value || !buttonRightRef.value || !progressBarRef.value) {
    return;
  }

  const distanceForLeftButton = calcProgressDistance(inputMinValue.value);
  const distanceForRightButton = calcProgressDistance(inputMaxValue.value);
  const totalProgress = distanceForRightButton - distanceForLeftButton;

  buttonLeftRef.value.style.left = `${distanceForLeftButton}%`;
  buttonRightRef.value.style.left = `${distanceForRightButton}%`;

  progressBarRef.value.style.left = `${distanceForLeftButton}%`;
  progressBarRef.value.style.width = `${totalProgress}%`;

  if (displayMinYear.value && displayMaxYear.value) {
    const minSide = displayMinYear.value.getBoundingClientRect().right;
    const maxSide = displayMaxYear.value.getBoundingClientRect().left;
    let diff = 0;

    if (maxSide - minSide <= 0) {
      diff = Math.abs(maxSide - minSide) * 1.5;
    }

    displayMinYear.value.style.left = `calc(${distanceForLeftButton}% - ${diff}px)`;
    displayMaxYear.value.style.left = `calc(${distanceForRightButton}% + ${diff}px)`;

    hiddenLeftStatic.value = distanceForLeftButton <= 15;
    hiddenRightStatic.value = distanceForRightButton >= 85;
  }
}

function onMouseMove(mouseEvent: MouseEvent) {
  if (mouseEvent.buttons !== 1 || side.value === null || !sliderRef.value) {
    return disableRange();
  }

  const borderLeftDistance = sliderRef.value.getBoundingClientRect().left;
  const width = sliderRef.value.clientWidth;

  const pointerCurrentPos = mouseEvent.clientX - borderLeftDistance;
  const percent = pointerCurrentPos / (width / 100);
  let value = Math.ceil(realRange * (percent / 100)) + props.minRange;

  if (side.value === 'right') {
    value = value > props.maxRange ? props.maxRange : value;
    updateRightInput(value);
  } else if (side.value === 'left') {
    value = value < props.minRange ? props.minRange : value;
    updateLeftInput(value);
  }

  updateProgressBar();
}
</script>

<style lang="scss" scoped>
.container {
  padding: 1.5rem 1rem;
  color: var(--black);
  border: 1px solid var(--gray-300);
  border-radius: 1rem;
  background-color: var(--white);
}

.title {
  margin: 0;
  padding: 0;
  font-size: 1rem;
  font-weight: 600;
}

.slider-container {
  --progress-height: 8px;
  --pointer-size: 24px;
  padding: 0.5rem 1rem;
  width: 100%;
  user-select: none;
}

.input {
  position: absolute;
  width: 100%;
  opacity: 0;
  pointer-events: none;
}

.slider {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: var(--pointer-size);

  &::after {
    content: '';
    position: sticky;
    z-index: 1050;
    inset: 0;
    display: none;
    min-width: 100%;
    height: 100vh;
  }

  &.enable {
    cursor: grab;

    &::after {
      display: unset;
    }
  }
}

.bar,
.progress {
  height: var(--progress-height);
  border-radius: 10rem;
}

.bar {
  position: absolute;
  min-width: 100%;
  background-color: var(--gray-300);
}

.progress {
  position: absolute;
  width: 100%;
  background-color: var(--primary);
  background-image: var(--grad-deg-purple);
  transition: 0.21s;
}

.left,
.right {
  position: absolute;
  width: var(--pointer-size);
  height: var(--pointer-size);
  border-radius: 50%;
  cursor: pointer;
  pointer-events: all;
  transform: translateX(-50%);
  transition: 0.21s;

  &:hover::before,
  &:hover::after {
    background-color: var(--gray-200);
  }

  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
  }

  &::before {
    transform: translate(-1px, -1px);
    width: calc(var(--pointer-size) + 2px);
    height: calc(var(--pointer-size) + 2px);
    background-color: var(--primary);
    background-image: var(--grad-deg-purple);
  }

  &::after {
    width: calc(var(--pointer-size));
    height: calc(var(--pointer-size));
    background-color: var(--white);
  }
}

.left {
  left: 0;
}

.right {
  left: 100%;
}

.display-range {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0 0;

  span {
    transition: 0.21s ease-out;
  }

  .hidden-value {
    opacity: 0;
  }
}

.display-year {
  position: absolute;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 .5rem;

  &:nth-of-type(2) {
    left: 0;
    transform: translateX(-50%);
  }

  &:nth-of-type(3) {
    left: 100%;
    transform: translateX(-50%);
  }
}

.display-year,
.display-range {
  font-weight: 700;
}
</style>
