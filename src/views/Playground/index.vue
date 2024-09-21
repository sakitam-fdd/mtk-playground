<template>
  <Header
    :store="store"
    :prod="productionMode"
    :ssr="useSSRMode"
    :save-loading="saveLoading"
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
      <div v-if="enableAdd" class="w-full flex justify-center pt-20px pb-20px">
        <el-button type="primary" @click="handleCreate">
          <el-icon class="el-icon--right">
            <Plus />
          </el-icon>
          <span class="ml-8px">新建示例/目录</span>
        </el-button>
      </div>
      <el-scrollbar
        class="!h-[calc(100%-72px)]"
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
    <PlaygroundForm :store="store" :data="current" :tree="list" :visible="saveVisible" @close="handleClose" />
  </div>
</template>

<script setup lang="ts">
  import { Repl, SFCOptions, useVueImportMap, mergeImportMap, File } from '@vue/repl';
  import Monaco from '@vue/repl/monaco-editor';
  import { ref, watchEffect, onMounted, computed, watch } from 'vue';
  import { Plus } from '@element-plus/icons-vue';
  import { ElMessage } from 'element-plus';
  import { useRouter, useRoute } from 'vue-router';
  import FileTree from '@/components/FileTree/index.vue';
  import { to } from '@/utils/to';
  import { useTheme } from '@/hooks/useTheme';
  import { getPlayground, matchSha, getFileTree, updatePlayground } from '@/api/graphql';
  import { IMPORTMAP_FILE, useStore } from './store';
  import Header from './Header.vue';
  import CreateForm from './CreateForm/index.vue';
  import PlaygroundForm from './PlaygroundForm/index.vue';
  import { buildCommit } from './Download/download';

  const replRef = ref<InstanceType<typeof Repl>>();
  const list = ref<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  // 暂时不启用用户自主创建目录
  const [enableAdd] = useState(false);
  const router = useRouter();
  const route = useRoute();
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

  const { name, category, subclass, productionMode: prodMode, ssrMode } = route.query;

  console.log(name, category, subclass, productionMode, ssrMode);

  watch(
    () => route.query,
    () => {
      if (prodMode === 'DEV') {
        productionMode.value = false;
      } else if (prodMode === 'PROD') {
        productionMode.value = true;
      }

      if (ssrMode === 'SSR') {
        useSSRMode.value = true;
      } else {
        useSSRMode.value = false;
      }
    },
    {
      immediate: true,
    },
  );

  const userImportMap = ref(
    mergeImportMap(importMap.value, {
      imports: {
        maptalks: 'https://esm.sh/maptalks@1.0.0-rc.33',
      },
    }),
  );
  const userFiles = ref({});
  const currentEditorFiles = ref([]);
  const { theme } = useTheme();

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

  const updateQuery = (newQuery: Record<string, string>) => {
    const currentQuery = { ...route.query };
    let hasChanges = false;

    // 检查是否有实际的变化
    for (const [key, value] of Object.entries(newQuery)) {
      if (currentQuery[key] !== value) {
        currentQuery[key] = value;
        hasChanges = true;
      }
    }

    // 只有在有实际变化时才更新 URL
    if (hasChanges) {
      const newURL = router.resolve({
        path: route.path,
        query: currentQuery,
      }).href;

      window.history.replaceState(null, '', newURL);
    }
  };

  // persist state
  watchEffect(() => {
    updateQuery({
      productionMode: productionMode.value ? 'PROD' : 'DEV',
      ssrMode: useSSRMode.value ? 'SSR' : '',
    });
  });

  const editorLoading = computed(() => userLoading.value);

  /**
   * 示例保存
   * 这里有两种情况
   * 1. 新建
   * 2. 已有的修改
   */
  const handleSave = async () => {
    setSaveLoading(true);
    // 添加全局loading，禁止用户操作
    setUserLoading(true);

    // 修改
    if (current.value?.depth === 3) {
      const content = buildCommit(store, true);

      const { needUpdate, data } = matchSha(currentEditorFiles.value, content);

      if (needUpdate) {
        const folder = current.value?.path;
        const [error, res] = await to<any>(updatePlayground(folder, data, true));
        if (!error) {
          ElMessage.success(`示例修改成功, 已创建 pr: ${res?.url}`);
        } else {
          ElMessage.error('示例修改失败');
        }
      } else {
        ElMessage.warning('示例无修改');
      }
      setSaveLoading(false);
      setUserLoading(false);
    } else {
      // 新建走弹窗
      setSaveVisible(true);
      setSaveLoading(false);
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

  const updateSideMenu = () => {
    for (let i = 0; i < list.value.length; i++) {
      const item = list.value[i];
      if (item.name === category) {
        item.collapse = false;
        if (item.children && item.children.length > 0) {
          for (let j = 0; j < item.children.length; j++) {
            const subItem = item.children[j];

            if (subItem.name === subclass) {
              subItem.collapse = false;

              if (subItem.children && subItem.children.length > 0) {
                for (let k = 0; k < subItem.children.length; k++) {
                  const playgroundItem = subItem.children[j];

                  if (playgroundItem.name === name) {
                    playgroundItem.collapse = false;
                    handleMenuSelect(playgroundItem, 3);
                    break;
                  }
                }
              }
              break;
            }
          }
        }
        break;
      }
    }
  };

  const getMenuList = async () => {
    setLoading(true);
    const data = await getFileTree();

    list.value = data;

    updateSideMenu();

    setLoading(false);
  };

  getMenuList();

  const handleCreate = () => {
    setDialogVisible(true);
  };

  function handleMenuSelect(m, d) {
    setCurrent({
      ...m,
      depth: d,
    });

    if (d === 3) {
      setUserLoading(true);
      if (m.ancestors) {
        updateQuery({
          name: m.name,
          category: m.ancestors[0]?.name,
          subclass: m.ancestors[1]?.name,
        });
      }

      getPlayground(m)
        .then((files: any[]) => {
          const fs = {};

          currentEditorFiles.value = files;

          for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (file.name === IMPORTMAP_FILE) {
              userImportMap.value = mergeImportMap(userImportMap.value, JSON.parse(file.playgroundCode));
            } else if (file.type === 'blob') {
              fs[file.playgroundPath] = new File(file.playgroundPath, file.playgroundCode);
            }
          }

          userFiles.value = fs;
        })
        .finally(() => {
          setUserLoading(false);
        });
    }
  }

  const handleClose = () => {
    setSaveVisible(false);
    setSaveLoading(false);
    setUserLoading(false);
  };

  watch(
    () => [category, subclass, name],
    () => {
      updateSideMenu();
    },
    {
      immediate: true,
    },
  );

  onMounted(() => {
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
    --color-branding: var(--el-color-primary) !important;
    --color-branding-dark: var(--el-color-primary-dark-2) !important;
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
