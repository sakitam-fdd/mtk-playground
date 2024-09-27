import { isObject } from 'lodash-es';
import { createI18n } from 'vue-i18n';
import type { App, WritableComputedRef } from 'vue';

import enLocale from 'element-plus/dist/locale/en.mjs';
import zhLocale from 'element-plus/dist/locale/zh-cn.mjs';

export enum LocaleEnum {
  ZH_CN = 'zh-cn',
  EN_US = 'en',
}

export function getDefaultLang(def: LocaleEnum) {
  if (def) {
    return def;
  }
  const browserLang = navigator.language.toLowerCase();
  return ['cn', 'zh', 'zh-cn'].includes(browserLang) ? LocaleEnum.ZH_CN : LocaleEnum.EN_US;
}

export function getContent(files: Record<string, any>) {
  const content: Record<string, unknown> = Object.entries(files).reduce((acc, [, value]) => ({ ...acc, ...value }), {});
  return content;
}

const mappingI18n = (function () {
  // const f = import.meta.glob('../locales/en/*.y(a)?ml', { eager: true })
  const cache = {
    'zh-CN': getContent(import.meta.glob(`../locales/zh-CN/*.y(a)?ml`, { eager: true, import: 'default' })),
    en: getContent(import.meta.glob(`../locales/en/*.y(a)?ml`, { eager: true, import: 'default' })),
  };

  return (prefix = 'zh-CN') => cache[prefix];
})();

export const localesConfigs = {
  'zh-cn': {
    ...mappingI18n('zh-CN'),
    ...zhLocale,
  },
  en: {
    ...mappingI18n('en'),
    ...enLocale,
  },
};

function getObjectKeys(obj) {
  const stack: any[] = [];
  const keys: Set<string> = new Set();

  stack.push({ obj, key: '' });

  while (stack.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { obj, key } = stack.pop();

    for (const k in obj) {
      const newKey = key ? `${key}.${k}` : k;

      if (obj[k] && isObject(obj[k])) {
        stack.push({ obj: obj[k], key: newKey });
      } else {
        keys.add(newKey);
      }
    }
  }

  return keys;
}

const keysCache: Map<string, Set<string>> = new Map();
const flatI18n = (prefix = 'zh-CN') => {
  let cache = keysCache.get(prefix);
  if (!cache) {
    cache = getObjectKeys(mappingI18n(prefix));
    keysCache.set(prefix, cache);
  }
  return cache;
};

export const $t = (key: string) => key;

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') ?? getDefaultLang(LocaleEnum.ZH_CN),
  fallbackLocale: getDefaultLang(LocaleEnum.EN_US),
  messages: localesConfigs,
});

export function t(message: any = '') {
  if (!message) {
    return '';
  }

  if (typeof message === 'object') {
    const locale: string | WritableComputedRef<string> | any = i18n.global.locale;
    return message[locale?.value];
  }

  const key = message.match(/(\S*)\./)?.input;

  if (key && flatI18n('zh-CN').has(key)) {
    return i18n.global.t.call(i18n.global.locale, message);
  }
  if (!key && Object.hasOwn(mappingI18n('zh-CN'), message)) {
    return i18n.global.t.call(i18n.global.locale, message);
  }
  return message;
}

export function setupI18n(app: App) {
  app.use(i18n);
}
