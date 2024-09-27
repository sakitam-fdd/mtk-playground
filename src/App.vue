<template>
  <ElConfigProvider :locale="locale">
    <router-view></router-view>
  </ElConfigProvider>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
  import enUS from 'element-plus/dist/locale/en.mjs';
  import { useAppStore } from '@/store/modules';
  import { LocaleEnum } from '@/plugins/locales';

  const appStore = useAppStore();
  const locale = computed(() => {
    switch (appStore.getLocale) {
      case LocaleEnum.ZH_CN:
        return zhCn;
      case LocaleEnum.EN_US:
        return enUS;
      default:
        return zhCn;
    }
  });
</script>

<style lang="less"></style>
