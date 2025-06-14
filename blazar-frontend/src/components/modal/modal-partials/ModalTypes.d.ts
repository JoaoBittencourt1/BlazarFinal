import type { PropType } from 'vue';

export type ModalContainerLayoutProps = {
  visibility: boolean;
  footerAlign?: 'start' | 'center' | 'end';
  changeVisibility: () => void;
};

export type DashboardsSelectionProp = PropType<Array<{
  id: number;
  title: string;
}>>;
