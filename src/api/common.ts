import http from './request';
import * as API from './apis';
import { CommonEnumType } from './schema/common';

export function getEnums() {
  return http.get<CommonEnumType>(API.BASE_ENUM, {});
}
