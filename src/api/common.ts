import http from './request';
import * as API from './apis';
import { ITemplate } from './schema/template';

export function getSomething() {
  return http.get<ITemplate>(API.TEST_API, {});
}
