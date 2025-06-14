import type { PropType } from 'vue';

type ButtonComponent = {
  type: 'button' | 'reset' | 'submit';
  format: 'primary' | 'muted';
};

export type TypeProp = PropType<ButtonComponent['type']>;
export type FormatProp = PropType<ButtonComponent['format']>;
