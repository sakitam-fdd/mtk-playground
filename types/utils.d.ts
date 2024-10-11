import type { ComputedRef, Ref } from 'vue';

export type DynamicProps<T> = {
  [P in keyof T]: Ref<T[P]> | T[P] | ComputedRef<T[P]>;
};

export type ArrayValueKeys<T> = {
  [K in keyof T]: T[K] extends any[] ? K : never;
}[keyof T];

export type PiceAnyOfTypes<T> = Pick<T, ArrayValueKeys<T>>;
