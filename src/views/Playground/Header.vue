<template>
  <nav>
    <h1>
      <img alt="logo" src="@/assets/icon/logo.svg" />
      <span>Maptalks Playground</span>
    </h1>
    <div class="flex items-center">
      <VersionSelect
        :model-value="mtkVersion"
        @update:model-value="setVueVersion"
        pkg="maptalks"
        label="Maptalks Version"
      >
        <li :class="{ active: mtkVersion === `@${currentCommit}` }"></li>
        <li>
          <a href="https://app.netlify.com/sites/vue-sfc-playground/deploys" target="_blank">Commits History</a>
        </li>
      </VersionSelect>
      <el-button
        type="text"
        title="Toggle development production mode"
        class="toggle-prod"
        :class="{ prod }"
        @click="$emit('toggle-prod')"
      >
        <span>{{ prod ? 'PROD' : 'DEV' }}</span>
      </el-button>
      <el-button
        type="text"
        title="Toggle server rendering mode"
        class="toggle-ssr"
        :class="{ enabled: ssr }"
        @click="$emit('toggle-ssr')"
      >
        <span>{{ ssr ? 'SSR ON' : 'SSR OFF' }}</span>
      </el-button>
      <el-tooltip :content="isDark ? '亮色' : '暗色'">
        <el-button type="text" title="Toggle dark mode" class="toggle-dark" @click="toggleDark">
          <span v-if="!isDark" class="i-ant-design:sun-outlined w-1.5em h-1.5em"></span>
          <span v-else class="i-ant-design:moon-outlined w-1.5em h-1.5em"></span>
        </el-button>
      </el-tooltip>
      <el-tooltip content="保存">
        <el-button type="text" :loading="saveLoading" title="保存页面" class="save" @click="$emit('save')">
          <span class="i-ant-design:save-outlined w-1.5em h-1.5em"></span>
        </el-button>
      </el-tooltip>
      <el-tooltip content="刷新页面">
        <el-button type="text" title=" 刷新页面" class="reload" @click="$emit('reload-page')">
          <span class="i-ant-design:reload-outlined w-1.5em h-1.5em"></span>
        </el-button>
      </el-tooltip>
      <el-tooltip content="复制分享链接">
        <el-button type="text" title="复制分享链接" class="share" @click="copyLink">
          <span class="i-ant-design:share-alt-outlined w-1.5em h-1.5em"></span>
        </el-button>
      </el-tooltip>
      <el-tooltip content="打包下载项目">
        <el-popconfirm title="确认打包下载项目文件?" @confirm="downloadProject(store)">
          <template #reference>
            <el-button type="text" title="打包下载项目" class="download">
              <span class="i-ant-design:download-outlined w-1.5em h-1.5em"></span>
            </el-button>
          </template>
        </el-popconfirm>
      </el-tooltip>
      <el-link
        href="https://github.com/vuejs/core/tree/main/packages-private/sfc-playground"
        target="_blank"
        rel="noopener noreferrer"
        title="View on GitHub"
        class="ml-10px"
      >
        <span class="i-ant-design:github-outlined w-1.5em h-1.5em"></span>
      </el-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import type { ReplStore } from '@vue/repl';
  import { ElMessage } from 'element-plus';
  import { useDark } from '@vueuse/core';
  import { downloadProject } from './Download/download';
  import VersionSelect from './VersionSelect.vue';

  const props = defineProps<{
    store: ReplStore;
    prod: boolean;
    ssr: boolean;
    saveLoading: boolean;
  }>();

  const emit = defineEmits(['toggle-theme', 'toggle-ssr', 'toggle-prod', 'reload-page', 'save']);

  const isAppearanceTransition =
    document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const { store } = props;

  const isDark = useDark();

  const currentCommit = '3.4.27';

  const mtkVersion = computed(() => {
    if (store.loading) {
      return 'loading...';
    }
    return '1.0.0-rc.35';
  });

  async function setVueVersion(v: string) {
    store.vueVersion = v;
  }

  async function copyLink(e: MouseEvent) {
    if (e.metaKey) {
      // hidden logic for going to local debug from play.vuejs.org
      window.location.href = `http://localhost:5173/${window.location.hash}`;
      return;
    }
    await navigator.clipboard.writeText(window.location.href);
    ElMessage.success('分享链接已经复制到剪切板.');
  }

  function toggleDark(event?: MouseEvent) {
    if (!isAppearanceTransition || !event) {
      isDark.value = !isDark.value;
      emit('toggle-theme', isDark.value);
      return;
    }
    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    // @ts-expect-error: Transition API
    const transition = document.startViewTransition(async () => {
      isDark.value = !isDark.value;
      emit('toggle-theme', isDark.value);
      await nextTick();
    });
    transition.ready.then(() => {
      const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];
      document.documentElement.animate(
        {
          clipPath: isDark.value ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 400,
          easing: 'ease-in',
          pseudoElement: isDark.value ? '::view-transition-old(root)' : '::view-transition-new(root)',
        },
      );
    });
  }
</script>

<style>
  nav {
    --bg: #fff;
    --bg-light: #fff;
    --border: #ddd;
    --btn: #666;
    --highlight: #333;
    --green: #3ca877;
    --purple: #904cbc;
    --btn-bg: #eee;

    color: var(--base);
    height: var(--nav-height);
    box-sizing: border-box;
    padding: 0 1em;
    background-color: var(--bg);
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.33);
    position: relative;
    z-index: 999;
    display: flex;
    justify-content: space-between;
  }

  .dark nav {
    --base: #ddd;
    --bg: #1a1a1a;
    --bg-light: #242424;
    --border: #383838;
    --highlight: #fff;
    --btn-bg: #333;

    box-shadow: none;
    border-bottom: 1px solid var(--border);
  }

  h1 {
    font-weight: 500;
    display: inline-flex;
    place-items: center;
  }

  h1 img {
    height: 24px;
    margin-right: 10px;
  }

  @media (max-width: 560px) {
    h1 span {
      font-size: 0.9em;
    }
  }

  @media (max-width: 520px) {
    h1 span {
      display: none;
    }
  }

  .toggle-prod span,
  .toggle-ssr span {
    font-size: 12px;
    border-radius: 4px;
    padding: 4px 6px;
  }

  .toggle-prod span {
    background: var(--el-color-primary);
    color: #fff;
  }

  .toggle-prod.prod span {
    background: var(--purple);
  }

  .toggle-ssr span {
    background-color: var(--btn-bg);
  }

  .toggle-ssr.enabled span {
    color: #fff;
    background-color: var(--el-color-primary);
  }

  .version:hover .active-version::after {
    border-top-color: var(--btn);
  }

  .dark .version:hover .active-version::after {
    border-top-color: var(--highlight);
  }

  .versions {
    display: none;
    position: absolute;
    left: 0;
    top: 40px;
    background-color: var(--bg-light);
    border: 1px solid var(--border);
    border-radius: 4px;
    list-style-type: none;
    padding: 8px;
    margin: 0;
    width: 200px;
    max-height: calc(100vh - 70px);
    overflow: scroll;
  }

  .versions a {
    display: block;
    padding: 6px 12px;
    text-decoration: none;
    cursor: pointer;
    color: var(--base);
  }

  .versions a:hover {
    color: var(--el-color-primary);
  }

  .versions.expanded {
    display: block;
  }
</style>
