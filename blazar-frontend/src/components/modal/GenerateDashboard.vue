<template>
  <ModalContainerLayout
    :change-visibility="closeModal"
    :visibility="visibility"
    :footer-align="actionButtonsAlign"
  >
    <template #title> Gerar Dashboard </template>

    <!-- Contents - steps -->
    <template #content v-if="modalStep === 'choose'">
      <DashboardsSelection />
    </template>

    <template #content v-else-if="modalStep === 'generate'">
      <h3 class="modal-dashboard-title">Crie seu novo dashboard</h3>

      <InputContent name="title" title="Título" :required="true" />
      <InputContent name="description" title="Descrição" />
    </template>

    <template #content v-else-if="modalStep === 'loading'">
      <LoadingBar />
    </template>

    <template #content v-else-if="modalStep === 'finished'">
      <ModalMessage>
        {{ completionMessage }}
      </ModalMessage>
    </template>

    <!-- Buttons - steps -->
    <template #action v-if="modalStep === 'choose'">
      <ButtonComponent format="primary" class="button-generate-dashboard" @click="createNewDashboard">
        <figure>
          <FontIcon icon='add' />
        </figure>

        Novo dashboard
      </ButtonComponent>
    </template>

    <template #action v-else-if="modalStep === 'generate'">
      <ButtonComponent @click="cancelProgress"> Cancelar </ButtonComponent>

      <ButtonComponent format="primary" @click="submitAction">
        Criar
      </ButtonComponent>
    </template>

    <template #action v-else-if="modalStep === 'loading'">
      <ButtonComponent @click="cancelProgress"> Cancelar </ButtonComponent>
    </template>

    <template #action v-else-if="modalStep === 'finished'">
      <ButtonComponent @click="closeModal"> Ir para dashboard </ButtonComponent>
    </template>
  </ModalContainerLayout>
</template>

<script lang="ts" setup>
import type { ModalProps, ModalSteps, ButtonsAlign } from './GenerateDashboard';
import ModalContainerLayout from './modal-partials/ModalContainerLayout.vue';
import DashboardsSelection from './modal-partials/DashboardsSelection.vue';
import InputContent from './modal-partials/InputContent.vue';
import ModalMessage from './modal-partials/ModalMessage.vue';
import LoadingBar from './modal-partials/LoadingBar.vue';
import ButtonComponent from '../buttons/ButtonComponent.vue';
import FontIcon from 'src/components/font-icon/FontIcon.vue';
import { ref } from 'vue';

const props = defineProps<ModalProps>();
const actionButtonsAlign = ref<ButtonsAlign>('end');
const modalStep = ref<ModalSteps>(props.initalStep || 'choose');
const completionMessage = ref<string>('');

// Fetch delay example
const timeOutToFinished = ref<ReturnType<typeof setTimeout>>();

function closeModal() {
  cancelProgress();
  props.changeVisibility();
}

function cancelProgress() {
  clearTimeout(timeOutToFinished.value);
  modalStep.value = props.initalStep || 'choose';
  actionButtonsAlign.value = 'end';
}

function createNewDashboard() {
  modalStep.value = 'generate';
  actionButtonsAlign.value = 'end';
}

function submitAction() {
  const titleInput = document.querySelector('[name=title]') as HTMLInputElement;
  const titleLabel = titleInput.parentNode as HTMLLabelElement;

  if (!titleInput || !titleLabel) return;

  if (!titleInput.checkValidity()) {
    titleLabel.classList.add('was-validate');
    return;
  }

  titleLabel.classList.remove('was-validate');

  if (props.isClean) {
    modalStep.value = 'finished';
    actionButtonsAlign.value = 'end';
    completionMessage.value = 'Seu dashboard foi criado com sucesso!';
  } else {
    modalStep.value = 'loading';
    actionButtonsAlign.value = 'center';

    // Fetch delay example
    clearTimeout(timeOutToFinished.value);
    timeOutToFinished.value = setTimeout(() => {
      modalStep.value = 'finished';
      actionButtonsAlign.value = 'end';
      completionMessage.value = 'Os gráficos foram adicionados com sucesso ao seu dashboard!';
    }, 12000);
  }
}
</script>

<style lang="scss" scoped>
@import './GenerateDashboard.scss';
</style>
