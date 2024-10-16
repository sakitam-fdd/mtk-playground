<template>
  <ElConfigProvider :locale="locale">
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </ElConfigProvider>
</template>

<script lang="ts" setup>
  import { computed, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
  import enUS from 'element-plus/dist/locale/en.mjs';
  import { useAppStore } from '@/store/modules';
  import { LocaleEnum } from '@/plugins/locales';

  const route = useRoute();

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

  watch(
    route,
    () => {
      if (route.meta.isPlayground) {
        document.documentElement.classList.add('playground-page');
      } else {
        document.documentElement.classList.remove('playground-page');
      }
    },
    { immediate: true },
  );
</script>

<style lang="less"></style>
