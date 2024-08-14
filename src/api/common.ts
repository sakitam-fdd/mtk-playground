import GisIcon from '~icons/oui/app-gis';
import LayerIcon from '~icons/gis/layer-height';
import GLTFIcon from '~icons/file-icons/gltf';
import SphereIcon from '~icons/tabler/cube-3d-sphere';
import http from './request';
import * as API from './apis';
import { CommonEnumType } from './schema/common';

export function getEnums() {
  return http.get<CommonEnumType>(API.BASE_ENUM, {});
}

export const playgroundTypes = [
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
];
