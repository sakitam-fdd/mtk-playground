<template>
  <div class="container-error flex flex-col items-center justify-center">
    <h1>404</h1>
    <p>抱歉，页面不见了～</p>
    <el-button class="mt-30px" key="back" type="primary" @click="back">返回上一页</el-button>
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
