<template>
  <Header
    :store="store"
    :prod="productionMode"
    :ssr="useSSRMode"
    :save-loading="saveLoading"
    @toggle-theme="toggleTheme"
    @toggle-prod="toggleProdMode"
    @toggle-ssr="toggleSSR"
    @reload-page="reloadPage"
    @save="handleSave"
  />
  <div class="flex">
    <div
      class="nav-wrap w-250px min-w-250px max-w-250px flex-[0_0_auto] bg-[var(--bg)] border-r-1 border-[var(--m-border)]"
      v-loading="loading"
    >
      <div v-if="enableAdd" class="wh-full flex justify-center pt-20px">
        <el-button type="primary" @click="handleCreate">
          <el-icon class="el-icon--right">
            <Plus />
          </el-icon>
          <span class="ml-8px">新建示例/目录</span>
        </el-button>
      </div>
      <el-scrollbar
        :wrap-style="{
          display: 'flex',
          'flex-wrap': 'wrap',
          margin: '0 auto',
          transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        }"
        :view-style="{
          display: 'flex',
          flex: 'auto',
          overflow: 'hidden',
          'flex-direction': 'column',
        }"
      >
        <FileTree v-if="list.length > 0" :data="list" :menu-key="current?.path" @change="handleMenuSelect"></FileTree>
      </el-scrollbar>
    </div>
    <div class="flex-auto min-h-0" v-loading="editorLoading">
      <Repl
        ref="replRef"
        :theme="theme"
        :editor="Monaco"
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
        @keydown.ctrl.s.prevent
        @keydown.meta.s.prevent
      />
    </div>

    <CreateForm :current="current" :visible="dialogVisible" @close="dialogVisible = false" />
    <PlaygroundForm :store="store" :current="current" :visible="saveVisible" @close="saveVisible = false" />
  </div>
</template>

<script setup lang="ts">
  import { Repl, SFCOptions, useVueImportMap, mergeImportMap, File } from '@vue/repl';
  import Monaco from '@vue/repl/monaco-editor';
  import { ref, watchEffect, onMounted, computed } from 'vue';
  import { Plus } from '@element-plus/icons-vue';
  import { ElMessage } from 'element-plus';
  import FileTree from '@/components/FileTree/index.vue';
  import { to } from '@/utils/to';
  import { createBranch, createFile, getFileTree, buildBranch, isSuccess, getPlayground } from '@/api/github';
  import { IMPORTMAP_FILE, useStore } from './store';
  import Header from './Header.vue';
  import CreateForm from './CreateForm/index.vue';
  import PlaygroundForm from './PlaygroundForm/index.vue';
  import { buildCommit } from './Download/download';

  const replRef = ref<InstanceType<typeof Repl>>();
  const list = ref<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [enableAdd] = useState(false);

  const setVH = () => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`);
  };
  window.addEventListener('resize', setVH);
  setVH();

  const useSSRMode = ref(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [saveVisible, setSaveVisible] = useState(false);
  const [current, setCurrent] = useState<any>({});

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

  const userImportMap = ref(
    mergeImportMap(importMap.value, {
      imports: {
        maptalks: 'https://esm.sh/maptalks@1.0.0-rc.33',
      },
    }),
  );
  const userFiles = ref({});

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
    files: userFiles,
    builtinImportMap: userImportMap,
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
    const f = store.getFiles();
    console.log(f);
    // window.history.replaceState({}, '', newHash);
  });

  const editorLoading = computed(() => store.loading || userLoading);

  /**
   * 示例保存
   * 这里有两种情况
   * 1. 新建
   * 2. 已有的修改
   */
  const handleSave = async () => {
    setSaveLoading(true);

    if (current.value?.depth === 2) {
      setSaveVisible(true);
    } else if (current.value?.depth === 3) {
      const content = buildCommit(store);

      const branch = buildBranch();

      const [error, data] = await to(createBranch({ branchName: branch }));

      if (!error && isSuccess(data)) {
        const [e] = await to(
          createFile(content, {
            branch,
            folder: false,
          }),
        );

        if (!e) {
          ElMessage.success('示例修改成功');
        } else {
          ElMessage.error('示例修改失败');
        }
      } else {
        ElMessage.error('创建分支失败');
      }
    }
  };

  const toggleProdMode = () => {
    productionMode.value = !productionMode.value;
  };

  const toggleSSR = () => {
    useSSRMode.value = !useSSRMode.value;
  };

  const reloadPage = () => {
    replRef.value?.reload();
  };

  const theme = ref<'dark' | 'light'>('dark');
  const toggleTheme = (isDark: boolean) => {
    theme.value = isDark ? 'dark' : 'light';
  };

  const getMenuList = async () => {
    setLoading(true);
    const data = await getFileTree();

    list.value = data;
    setLoading(false);
  };

  getMenuList();

  const handleCreate = () => {
    setDialogVisible(true);
  };

  const handleMenuSelect = (m, d) => {
    setCurrent({
      ...m,
      depth: d,
    });

    if (d === 3) {
      setUserLoading(true);
      getPlayground(m)
        .then((files: any[]) => {
          const fs = {};
          for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (file.name === IMPORTMAP_FILE) {
              userImportMap.value = mergeImportMap(userImportMap.value, JSON.parse(file.playgroundCode));
            } else {
              fs[file.playgroundPath] = new File(file.playgroundPath, file.playgroundCode);
            }
          }

          userFiles.value = fs;
        })
        .finally(() => {
          setUserLoading(true);
        });
    }
  };

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
    --color-branding: var(--el-color-primary);
  }

  button {
    border: none;
    outline: none;
    cursor: pointer;
    margin: 0;
    background-color: transparent;
  }

  .nav-wrap {
    height: calc(100vh - 50px);
  }
</style>
