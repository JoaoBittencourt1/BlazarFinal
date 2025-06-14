import type { PropType } from 'vue';
import type { Categories } from '../_types';

type PublicationCard = {
  link: string;
  title: string;
  authors: Array<string>;
  ids: Array<unknown>;
  magazine: string;
  published: string;
  keywords: Array<string>;
};

export type ResultsScheme = Array<PublicationCard>;

export type ResultsProp = PropType<ResultsScheme>;
export type CategoryProp = PropType<Categories>;

export type PageProps = { results: ResultsScheme, updatePageAmountDisplay: Function };
