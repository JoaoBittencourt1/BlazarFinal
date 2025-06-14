import type { UseSharedStateProps } from './useSharedStateType'
import { defineStore } from 'pinia';

export const useSharedState = defineStore('app-shared-store', {
  state(): UseSharedStateProps {
    return {
      notify: {
        timeout: 2000,
      },
      searchEngine: {
        searchDelay: 750,
      },
    };
  },
});
