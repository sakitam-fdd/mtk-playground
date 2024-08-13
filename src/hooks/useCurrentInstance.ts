import { ComponentInternalInstance } from 'vue';

export default function useCurrentInstance() {
  const { proxy } = getCurrentInstance() as ComponentInternalInstance;

  return {
    proxy: proxy!,
  };
}
