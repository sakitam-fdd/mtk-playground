declare module 'fs-extra';
declare module 'less-vars-to-js';
declare module 'vite-plugin-fake-server/client';

declare global {
  type WithNull<T> = T | null;
  type WithUndef<T> = T | undefined;
  type Recordable<T = any> = Record<string, T>;
  type Partible<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
  type ObjToKeyValArray<T> = { [K in keyof T]: [K, T[K]] }[keyof T];
}
