<template>
  <ElConfigProvider :locale="locale">
    <router-view></router-view>
  </ElConfigProvider>
</template>

<script lang="ts">
  import { onMounted } from 'vue';
  import zhCn from 'element-plus/dist/locale/zh-cn.mjs';

  export default defineComponent({
    name: 'App',
    setup() {
      const locale = computed(() => zhCn);

      onMounted(() => {
        // setLocale(currentLocale.value);
        // appStore.toggleTheme(appStore.theme === 'dark');
      });

      return {
        locale,
      };
    },
  });
</script>

<style lang="less"></style>
