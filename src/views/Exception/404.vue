<template>
  <div class="container-error flex flex-col items-center justify-center">
    <h1>404</h1>
    <p>{{ $t('app.pages.404') }}</p>
    <el-button class="mt-30px" key="back" type="primary" @click="back">{{ $t('app.actions.back') }}</el-button>
  </div>
</template>

<script setup lang="ts">
  const router = useRouter();
  const back = () => {
    router.go(-1);
  };
</script>

<style scoped>
  @import url(./style.less);
</style>
