import { isEmpty } from 'lodash-es';
import { getEnums } from '@/api/common';

export interface EnumsState {
  enums: any;
}

export const useEnumsStore = defineStore('enums', {
  state: (): EnumsState => ({
    enums: {} as EnumsState['enums'],
  }),
  getters: {
    enum: (state) => state.enums,
  },
  actions: {
    async getEnums(force?: boolean) {
      if (isEmpty(this.enums) || force) {
        await getEnums()
          .then(() => {
            this.enums = res.data;
          })
          .catch(() => {
            this.enums = {} as EnumsState['enums'];
          });
      }
    },
  },
});
