import { store } from '@/store';
import { getDefaultLang, LocaleEnum, i18n } from '@/plugins/locales';
import GisIcon from '~icons/oui/app-gis';
import LayerIcon from '~icons/gis/layer-height';
import GLTFIcon from '~icons/file-icons/gltf';
import SphereIcon from '~icons/tabler/cube-3d-sphere';

export interface State {
  templates: any;
  playgroundTypes: any[];
  locale: LocaleEnum;
}

export const useAppStore = defineStore('app', {
  state: (): State => ({
    locale: (localStorage.getItem('locale') as LocaleEnum) ?? getDefaultLang(LocaleEnum.ZH_CN),
    templates: {} as State['templates'],
    playgroundTypes: [
      {
        id: 'basic',
        label: '基础功能',
        icon: GisIcon,
        collapse: true,
        rank: 1,
      },
      {
        id: 'vector',
        label: '矢量瓦片及点线面图层',
        icon: LayerIcon,
        collapse: true,
        rank: 2,
      },
      {
        id: 'gltf',
        label: 'GLTF模型',
        icon: GLTFIcon,
        collapse: true,
        rank: 3,
      },
      {
        id: '3d',
        label: '三维功能',
        icon: SphereIcon,
        collapse: true,
        rank: 4,
      },
    ],
  }),
  getters: {
    getLocale: (state) => state.locale,
  },
  actions: {
    setLocale(locale: LocaleEnum) {
      this.locale = locale;
      localStorage.setItem('locale', locale);
      i18n.global.locale.value = locale;
    },

    updatePlaygroundTypes(types) {
      this.playgroundTypes = types;
    },
  },
});

export function useAppStoreHook() {
  return useAppStore(store);
}
