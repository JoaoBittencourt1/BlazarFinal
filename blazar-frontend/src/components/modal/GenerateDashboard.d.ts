import type { ModalContainerLayoutProps } from './modal-partials/ModalTypes';

export type ModalSteps = 'choose' | 'generate' | 'loading' | 'finished';

export type ModalProps = {
  initalStep?: ModalSteps | undefined;
  isClean?: boolean | undefined;
  visibility: boolean;
  changeVisibility: () => void;
};

export type ButtonsAlign = ModalContainerLayoutProps['footerAlign'];
