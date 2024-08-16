import { isEmpty } from 'lodash-es';
import { store } from '@/store';
import { getSomething } from '@/api/common';

export interface State {
  templates: any;
}

export const useAppStore = defineStore('app', {
  state: (): State => ({
    templates: {} as State['templates'],
  }),
  getters: {
    templates: (state) => state.templates,
  },
  actions: {
    async getTemplates(force?: boolean) {
      if (isEmpty(this.templates) || force) {
        await getSomething()
          .then(() => {
            this.templates = res.data;
          })
          .catch(() => {
            this.templates = {} as State['templates'];
          });
      }
    },
  },
});

export function useAppStoreHook() {
  return useAppStore(store);
}
