import { ref } from 'vue';
import type { Ref, UnwrapRef } from 'vue';

export default function useState<T>(initialValue: T): [Ref<UnwrapRef<T>>, (v: T) => void] {
  const v = ref(initialValue);

  const set = (value) => {
    v.value = value;
  };

  return [v, set];
}
