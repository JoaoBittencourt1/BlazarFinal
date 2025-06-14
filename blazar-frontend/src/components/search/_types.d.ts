import type { PropType } from 'vue';

export type TablesColumn = {
  [key: string]: Array<{
    url?: string;
    content: string;
  }>;
};

export type TablesProp = PropType<TablesColumn>;

export type ListStyledItems = PropType<Array<{
  prefix: string;
  suffix?: string | undefined;
  url?: string | undefined;
}>>;

export type PropMouseEvent = PropType<(payload: MouseEvent) => void>;

export type Categories = 'molecules' | 'publications' | 'patents' | 'clinicalTrials';

export type SearchState = {
  termOfSearch: string;
  isLoading: boolean;
  categorySelected: Categories;
  compoundCid: Set<number>;
  multipleSearchData: Set<string>;
  freeSearchData: Set<string>;
};

export type HeaderOption = {
  value: Categories;
  describe: string;
  selected: boolean;
};
