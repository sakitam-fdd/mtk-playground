<template>
  <Header
    :store="store"
    :prod="productionMode"
    :ssr="useSSRMode"
    @toggle-theme="toggleTheme"
    @toggle-prod="toggleProdMode"
    @toggle-ssr="toggleSSR"
    @reload-page="reloadPage"
  />
  <div class="flex">
    <div class="w-250px min-w-250px max-w-250px flex-[0_0_auto] bg-[var(--bg)] border-r-1 border-[var(--m-border)]">
      <FileTree :data="list"></FileTree>
    </div>
    <div class="flex-auto min-h-0">
      <Repl
        ref="replRef"
        :theme="theme"
        :editor="Monaco"
        @keydown.ctrl.s.prevent
        @keydown.meta.s.prevent
        :ssr="useSSRMode"
        :store="store"
        :showCompileOutput="false"
        :autoResize="true"
        :showImportMap="true"
        :clearConsole="false"
        :preview-options="{
          customCode: {
            importCode: `import { initCustomFormatter } from 'vue'`,
            useCode: `if (window.devtoolsFormatters) {
    const index = window.devtoolsFormatters.findIndex((v) => v.__vue_custom_formatter)
    window.devtoolsFormatters.splice(index, 1)
    initCustomFormatter()
  } else {
    initCustomFormatter()
  }`,
          },
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Repl, useStore, SFCOptions, useVueImportMap } from '@vue/repl';
  import Monaco from '@vue/repl/monaco-editor';
  import { ref, watchEffect, onMounted, computed } from 'vue';
  import FileTree from '@/components/FileTree/index.vue';
  import Header from './Header.vue';

  const replRef = ref<InstanceType<typeof Repl>>();
  const list = ref<any[]>([
    {
      id: '0',
      label: '基础功能',
      icon: 'i-oui:app-gis',
      collapse: true,
      children: [
        {
          id: '0-0',
          label: '地图',
          icon: 'i-lets-icons:map',
          collapse: true,
          children: [
            {
              id: '0-0-0',
              label: '初始化地图',
            },
          ],
        },
      ],
    },
    {
      id: '1',
      label: '基础功能',
      icon: 'i-oui:app-gis',
      collapse: true,
      children: [
        {
          id: '1-0',
          label: '地图',
          icon: 'i-lets-icons:map',
          collapse: true,
          children: [
            {
              id: '1-0-0',
              label: '初始化地图',
            },
          ],
        },
      ],
    },
  ]);

  const setVH = () => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`);
  };
  window.addEventListener('resize', setVH);
  setVH();

  const useSSRMode = ref(false);

  const { productionMode, vueVersion, importMap } = useVueImportMap({
    runtimeDev: import.meta.env.PROD
      ? `${window.location.origin}/vue.runtime.esm-browser.js`
      : `${window.location.origin}/src/views/Playground/vue-dev-proxy`,
    runtimeProd: import.meta.env.PROD
      ? `${window.location.origin}/vue.runtime.esm-browser.prod.js`
      : `${window.location.origin}/src/views/Playground/vue-dev-proxy-prod`,
    serverRenderer: import.meta.env.PROD
      ? `${window.location.origin}/server-renderer.esm-browser.js`
      : `${window.location.origin}/src/views/Playground/vue-server-renderer-dev-proxy`,
  });

  let hash = window.location.hash.slice(1);
  if (hash.startsWith('__DEV__')) {
    hash = hash.slice(7);
    productionMode.value = false;
  }
  if (hash.startsWith('__PROD__')) {
    hash = hash.slice(8);
    productionMode.value = true;
  }
  if (hash.startsWith('__SSR__')) {
    hash = hash.slice(7);
    useSSRMode.value = true;
  }

  // enable experimental features
  const sfcOptions = computed(
    (): SFCOptions => ({
      script: {
        inlineTemplate: productionMode.value,
        isProd: productionMode.value,
        propsDestructure: true,
      },
      style: {
        isProd: productionMode.value,
      },
      template: {
        isProd: productionMode.value,
        compilerOptions: {
          isCustomElement: (tag: string) => tag === 'mjx-container' || tag.startsWith('custom-'),
        },
      },
    }),
  );

  const store = useStore({
    builtinImportMap: importMap,
    vueVersion,
    sfcOptions,
  });

  globalThis.store = store;

  // persist state
  watchEffect(() => {
    const newHash = store
      .serialize()
      .replace(/^#/, useSSRMode.value ? `#__SSR__` : `#`)
      .replace(/^#/, productionMode.value ? `#__PROD__` : `#`);
    console.log(newHash);
    // window.history.replaceState({}, '', newHash);
  });

  function toggleProdMode() {
    productionMode.value = !productionMode.value;
  }

  function toggleSSR() {
    useSSRMode.value = !useSSRMode.value;
  }

  function reloadPage() {
    replRef.value?.reload();
  }

  const theme = ref<'dark' | 'light'>('dark');
  function toggleTheme(isDark: boolean) {
    theme.value = isDark ? 'dark' : 'light';
  }
  onMounted(() => {
    const cls = document.documentElement.classList;
    toggleTheme(cls.contains('dark'));

    // @ts-expect-error process shim for old versions of @vue/compiler-sfc dependency
    window.process = { env: {} };
  });
</script>

<style lang="less">
  .dark {
    color-scheme: dark;
  }

  body {
    font-size: 13px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
      'Helvetica Neue', sans-serif;
    margin: 0;
    --base: #444;
    --nav-height: 50px;
  }

  .vue-repl {
    height: calc(var(--vh) - var(--nav-height)) !important;
  }

  button {
    border: none;
    outline: none;
    cursor: pointer;
    margin: 0;
    background-color: transparent;
  }
</style>
