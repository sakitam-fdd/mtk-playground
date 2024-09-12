import { isEmpty, update } from 'lodash-es';
import { store } from '@/store';
import { getSomething, playgroundTypes } from '@/api/common';
import GisIcon from '~icons/oui/app-gis';
import LayerIcon from '~icons/gis/layer-height';
import GLTFIcon from '~icons/file-icons/gltf';
import SphereIcon from '~icons/tabler/cube-3d-sphere';

export interface State {
  templates: any;
  playgroundTypes: any[];
}

export const useAppStore = defineStore('app', {
  state: (): State => ({
    templates: {} as State['templates'],
    playgroundTypes: [
      {
        label: '基础功能',
        icon: GisIcon,
        collapse: true,
      },
      {
        label: '矢量瓦片及点线面图层',
        icon: LayerIcon,
        collapse: true,
      },
      {
        label: 'GLTF模型',
        icon: GLTFIcon,
        collapse: true,
      },
      {
        label: '三维功能',
        icon: SphereIcon,
        collapse: true,
      },
    ],
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

    updatePlaygroundTypes(types) {
      this.playgroundTypes = types;
    },
  },
});

export function useAppStoreHook() {
  return useAppStore(store);
}
