import http from './request';
import * as API from './apis';
import { CommonEnumType } from './schema/common';

export function getEnums() {
  return http.get<CommonEnumType>(API.BASE_ENUM, {});
}

export const playgroundTypes = [
  {
    id: '0',
    label: '基础功能',
    icon: 'i-oui:app-gis',
    collapse: true,
  },
  {
    id: '1',
    label: '矢量瓦片及点线面图层',
    icon: 'i-gis:layer-height',
    collapse: true,
  },
  {
    id: '2',
    label: 'GLTF模型',
    icon: 'i-file-icons:gltf',
    collapse: true,
  },
  {
    id: '3',
    label: '三维功能',
    icon: 'i-tabler:cube-3d-sphere',
    collapse: true,
  },
];
