<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { ElMessage } from 'element-plus';
  import { useI18n } from 'vue-i18n';

  const expanded = ref(false);
  const versions = ref<string[]>();
  const { t } = useI18n();

  const version = defineModel();
  const props = defineProps<{
    pkg: string;
    label: string;
  }>();

  async function toggle() {
    expanded.value = !expanded.value;
    if (!versions.value) {
      versions.value = await fetchVersions();
    }
  }

  async function fetchVersions(): Promise<string[]> {
    const res = await fetch(`https://data.jsdelivr.com/v1/package/npm/${props.pkg}`);
    const pkg = (await res.json()) as { versions: string[] };

    if (props.pkg === 'vue') {
      // if the latest version is a pre-release, list all current pre-releases
      // otherwise filter out pre-releases
      let isInPreRelease = versions.value[0].includes('-');
      const filteredVersions: string[] = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const v of versions) {
        if (v.includes('-')) {
          if (isInPreRelease) {
            filteredVersions.push(v);
          }
        } else {
          filteredVersions.push(v);
          isInPreRelease = false;
        }
        if (filteredVersions.length >= 30 || v === '3.0.10') {
          break;
        }
      }
      return filteredVersions;
    }
    if (props.pkg === 'typescript') {
      return pkg.versions.filter((v) => !v.includes('dev') && !v.includes('insiders'));
    }
    return pkg.versions;
  }

  function setVersion(v: string) {
    version.value = v;
    expanded.value = false;
  }

  function copyVersion(v: string) {
    window.navigator.clipboard.writeText(v).then(() => {
      ElMessage.success(t('app.tips.result.copyVersion'));
    });
  }

  onMounted(() => {
    window.addEventListener('click', () => {
      expanded.value = false;
    });
    window.addEventListener('blur', () => {
      if (document.activeElement?.tagName === 'IFRAME') {
        expanded.value = false;
      }
    });
  });
</script>

<template>
  <div class="mr-3 relative" @click.stop>
    <span class="cursor-pointer relative inline-flex items-center" @click="toggle">
      {{ label }}
      <span class="text-[var(--el-color-primary)] ml-4px">{{ version }}</span>
    </span>

    <ul class="versions" :class="{ expanded: expanded }">
      <li v-if="!versions"><a>loading versions...</a></li>
      <li
        v-for="(ver, index) of versions"
        :key="ver"
        class="flex justify-between"
        :class="{
          active: ver === version || (version === 'latest' && index === 0),
        }"
      >
        <a @click="setVersion(ver)">v{{ ver }}</a>
        <button type="button" title="Copy Version" class="group-hover:block" @click="copyVersion(`v${ver}`)">
          <span class="i-ant-design:copy-outlined"></span>
        </button>
      </li>
      <li @click="expanded = false" @keypress.enter="expanded = false">
        <slot />
      </li>
    </ul>
  </div>
</template>

<style>
  .versions .active a {
    color: var(--el-color-primary);
  }

  .active-version::after {
    content: ' ';
    @apply w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-gray-400 ml-2;
  }
</style>
