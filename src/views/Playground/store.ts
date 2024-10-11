/* eslint-disable @typescript-eslint/no-shadow, @typescript-eslint/no-use-before-define, default-param-last */

import { File, compileFile, mergeImportMap, useVueImportMap } from '@vue/repl';
import * as defaultCompiler from 'vue/compiler-sfc';
import type { ReplStore, StoreState, Store, ImportMap } from '@vue/repl';
import { ref, computed } from 'vue';
import type { Ref } from 'vue';

const appFileCode = `
<template>
  <div class="playground-content" ref="mapRef"></div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';

  const mapRef = ref<HTMLDivElement>();
  const emits = defineEmits(['mount']);

  let map;

  async function initMap() {
    const maptalks = await import('maptalks');

    map = new maptalks.Map(mapRef.value, {
      zoom: 2,
      center: [34.371, 131.287].reverse(),
      baseLayer: new maptalks.TileLayer('base', {
        urlTemplate: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        // urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        subdomains: ['a', 'b', 'c', 'd'],
        repeatWorld: 'x',
      })
    });

    emits('mount');
  }

  onMounted(() => {
    initMap();
  });

  defineExpose({
    pause: () => {},
    resume: () => {},
  });
</script>

<style>
  .playground-content {
    width: 100%;
    height: 450px;
  }
</style>
`.trim();

const tsconfig = {
  compilerOptions: {
    allowJs: true,
    checkJs: true,
    jsx: 'Preserve',
    target: 'ESNext',
    module: 'ESNext',
    moduleResolution: 'Bundler',
    allowImportingTsExtensions: true,
  },
  vueCompilerOptions: {
    target: 3.4,
  },
};

export const APP_FILE = 'src/App.vue';
export const IMPORTMAP_FILE = 'import-map.json';
export const TSCONFIG_FILE = 'tsconfig.json';

const utoa = (data: string) => btoa(unescape(encodeURIComponent(data)));

const atou = (b64: string) => decodeURIComponent(escape(atob(b64)));

const filterFiles = [IMPORTMAP_FILE];

function setFile(files: Record<string, File>, filename: string, content: string) {
  const normalized = addSrcPrefix(filename);
  files[normalized] = new File(normalized, content);
}

function addSrcPrefix(file: string) {
  return file === IMPORTMAP_FILE || file === TSCONFIG_FILE || file.startsWith('src/') ? file : `src/${file}`;
}

export function stripSrcPrefix(file: string) {
  return file.replace(/^src\//, '');
}

function fixURL(url: string) {
  return url.replace('https://sfc.vuejs', 'https://play.vuejs');
}

export function useStore(
  {
    files = ref(Object.create(null)),
    activeFilename = undefined!, // set later
    mainFile = ref('src/App.vue'),
    template = ref({
      welcomeSFC: appFileCode,
      newSFC: appFileCode,
    }),
    builtinImportMap = undefined!, // set later

    errors = ref([]),
    showOutput = ref(false),
    outputMode = ref('preview'),
    sfcOptions = ref({}),
    compiler = shallowRef(defaultCompiler),
    vueVersion = ref(null),
    mtkVersion = ref<WithNull<string>>(null),

    locale = ref(),
    typescriptVersion = ref('latest'),
    dependencyVersion = ref(Object.create(null)),
    reloadLanguageTools = ref(),
  }: Partial<StoreState> & { mtkVersion?: Ref<WithNull<string>> } = {},
  serializedState?: string,
): ReplStore {
  if (!builtinImportMap) {
    ({ importMap: builtinImportMap, vueVersion } = useVueImportMap({
      vueVersion: vueVersion.value,
    }));
  }
  const loading = ref(false);

  function applyBuiltinImportMap() {
    const importMap = mergeImportMap(builtinImportMap.value, getImportMap());
    setImportMap(importMap);
  }

  function init() {
    watchEffect(() => {
      compileFile(store, activeFile.value).then((errs) => (errors.value = errs));
    });

    watch(
      () => [
        files.value[TSCONFIG_FILE]?.code,
        typescriptVersion.value,
        locale.value,
        dependencyVersion.value,
        vueVersion.value,
        mtkVersion.value,
      ],
      () => reloadLanguageTools.value?.(),
      { deep: true },
    );

    watch(
      builtinImportMap,
      () => {
        setImportMap(mergeImportMap(getImportMap(), builtinImportMap.value));
      },
      { deep: true },
    );

    watch(
      vueVersion,
      async (version) => {
        if (version) {
          const compilerUrl = `https://cdn.jsdelivr.net/npm/@vue/compiler-sfc@${version}/dist/compiler-sfc.esm-browser.js`;
          loading.value = true;
          compiler.value = await import(/* @vite-ignore */ compilerUrl).finally(() => (loading.value = false));
          console.info(`[@vue/repl] Now using Vue version: ${version}`);
        } else {
          // reset to default
          compiler.value = defaultCompiler;
          console.info(`[@vue/repl] Now using default Vue version`);
        }
      },
      { immediate: true },
    );

    watch(
      sfcOptions,
      () => {
        sfcOptions.value.script ||= {};
        sfcOptions.value.script.fs = {
          fileExists(file: string) {
            if (file.startsWith('/')) file = file.slice(1);
            return !!store.files[file];
          },
          readFile(file: string) {
            if (file.startsWith('/')) file = file.slice(1);
            return store.files[file].code;
          },
        };
      },
      { immediate: true },
    );

    // init tsconfig
    if (!files.value[TSCONFIG_FILE]) {
      files.value[TSCONFIG_FILE] = new File(TSCONFIG_FILE, JSON.stringify(tsconfig, undefined, 2));
    }

    // compile rest of the files
    errors.value = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const [filename, file] of Object.entries(files.value)) {
      if (filename !== mainFile.value) {
        compileFile(store, file).then((errs) => errors.value.push(...errs));
      }
    }
  }

  function setImportMap(map: ImportMap) {
    if (map.imports)
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of Object.entries(map.imports)) {
        if (value) {
          map.imports![key] = fixURL(value);
        }
      }

    const code = JSON.stringify(map, undefined, 2);
    if (files.value[IMPORTMAP_FILE]) {
      files.value[IMPORTMAP_FILE].code = code;
    } else {
      files.value[IMPORTMAP_FILE] = new File(IMPORTMAP_FILE, code);
    }
  }

  const setActive: Store['setActive'] = (filename) => {
    activeFilename.value = filename;
  };
  const addFile: Store['addFile'] = (fileOrFilename) => {
    let file: File;
    if (typeof fileOrFilename === 'string') {
      file = new File(fileOrFilename, fileOrFilename.endsWith('.vue') ? template.value.newSFC : '');
    } else {
      file = fileOrFilename;
    }
    files.value[file.filename] = file;
    if (!file.hidden) setActive(file.filename);
  };
  const deleteFile: Store['deleteFile'] = (filename) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm(`Are you sure you want to delete ${stripSrcPrefix(filename)}?`)) {
      return;
    }

    if (activeFilename.value === filename) {
      activeFilename.value = mainFile.value;
    }
    delete files.value[filename];
  };
  const renameFile: Store['renameFile'] = (oldFilename, newFilename) => {
    const file = files.value[oldFilename];

    if (!file) {
      errors.value = [`Could not rename "${oldFilename}", file not found`];
      return;
    }

    if (!newFilename || oldFilename === newFilename) {
      errors.value = [`Cannot rename "${oldFilename}" to "${newFilename}"`];
      return;
    }

    file.filename = newFilename;
    const newFiles: Record<string, File> = {};

    // Preserve iteration order for files
    // eslint-disable-next-line no-restricted-syntax
    for (const [name, file] of Object.entries(files.value)) {
      if (name === oldFilename) {
        newFiles[newFilename] = file;
      } else {
        newFiles[name] = file;
      }
    }

    files.value = newFiles;

    if (mainFile.value === oldFilename) {
      mainFile.value = newFilename;
    }
    if (activeFilename.value === oldFilename) {
      activeFilename.value = newFilename;
    } else {
      compileFile(store, file).then((errs) => (errors.value = errs));
    }
  };
  const getImportMap: Store['getImportMap'] = () => {
    try {
      return JSON.parse(files.value[IMPORTMAP_FILE].code);
    } catch (e) {
      errors.value = [`Syntax error in ${IMPORTMAP_FILE}: ${(e as Error).message}`];
      return {};
    }
  };
  const getTsConfig: Store['getTsConfig'] = () => {
    try {
      return JSON.parse(files.value[TSCONFIG_FILE].code);
    } catch {
      return {};
    }
  };
  const serialize: ReplStore['serialize'] = () => {
    const files = getFiles();
    const importMap = files[IMPORTMAP_FILE];
    if (importMap) {
      const parsed = JSON.parse(importMap);
      const builtin = builtinImportMap.value.imports || {};

      if (parsed.imports) {
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of Object.entries(parsed.imports)) {
          if (builtin[key] === value) {
            delete parsed.imports[key];
          }
        }
        if (parsed.imports && !Object.keys(parsed.imports).length) {
          delete parsed.imports;
        }
      }
      if (parsed.scopes && !Object.keys(parsed.scopes).length) {
        delete parsed.scopes;
      }
      if (Object.keys(parsed).length) {
        files[IMPORTMAP_FILE] = JSON.stringify(parsed, null, 2);
      } else {
        delete files[IMPORTMAP_FILE];
      }
    }
    if (vueVersion.value) files._version = vueVersion.value;
    return `#${utoa(JSON.stringify(files))}`;
  };
  const deserialize: ReplStore['deserialize'] = (serializedState: string) => {
    if (serializedState.startsWith('#')) serializedState = serializedState.slice(1);
    let saved: any;
    try {
      saved = JSON.parse(atou(serializedState));
    } catch (err) {
      console.error(err);
      alert('Failed to load code from URL.');
      return setDefaultFile();
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const filename in saved) {
      if (filename === '_version') {
        vueVersion.value = saved[filename];
      } else {
        setFile(files.value, filename, saved[filename]);
      }
    }
  };
  const getFiles: ReplStore['getFiles'] = () => {
    const exported: Record<string, string> = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const [filename, file] of Object.entries(files.value)) {
      const normalized = stripSrcPrefix(filename);
      exported[normalized] = file.code;
    }
    return exported;
  };
  const setFiles: ReplStore['setFiles'] = async (newFiles, mainFile = store.mainFile) => {
    const files: Record<string, File> = Object.create(null);

    mainFile = addSrcPrefix(mainFile);
    if (!newFiles[mainFile]) {
      setFile(files, mainFile, template.value.welcomeSFC || appFileCode);
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const [filename, file] of Object.entries(newFiles)) {
      setFile(files, filename, file);
    }

    const errors = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const file of Object.values(files)) {
      errors.push(...(await compileFile(store, file)));
    }

    store.mainFile = mainFile;
    store.files = files;
    store.errors = errors;
    applyBuiltinImportMap();
    setActive(store.mainFile);
  };
  const setDefaultFile = (): void => {
    setFile(files.value, mainFile.value, template.value.welcomeSFC || appFileCode);
  };

  if (serializedState) {
    deserialize(serializedState);
  } else {
    setDefaultFile();
  }
  if (!files.value[mainFile.value]) {
    mainFile.value = Object.keys(files.value)[0];
  }
  activeFilename ||= ref(mainFile.value);
  const activeFile = computed(() => files.value[activeFilename.value]);

  applyBuiltinImportMap();

  const setMtkVersion = (v: string) => {
    const m = getImportMap();
    mtkVersion.value = v;
    // compileFile(this, install).then((errs) => this.state.errors.push(...errs));
    setImportMap({
      imports: {
        ...m.imports,
        maptalks: `https://esm.sh/maptalks@${v}`,
      },
      scopes: m.scopes,
    });
  };

  const store: ReplStore = reactive({
    files,
    activeFile,
    activeFilename,
    mainFile,
    template,
    builtinImportMap,

    errors,
    showOutput,
    outputMode,
    sfcOptions,
    compiler,
    loading,
    vueVersion,
    mtkVersion,
    locale,
    typescriptVersion,
    dependencyVersion,
    reloadLanguageTools,

    init,
    setActive,
    addFile,
    deleteFile,
    renameFile,
    getImportMap,
    getTsConfig,
    serialize,
    deserialize,
    getFiles,
    setFiles,
    setMtkVersion,
  });
  return store;
}
