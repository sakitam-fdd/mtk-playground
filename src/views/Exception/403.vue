<template>
  <div class="container-error flex flex-col items-center justify-center">
    <h1>401</h1>
    <p>对不起，您没有访问该资源的权限～</p>
    <el-button class="mt-30px" key="back" type="primary" @click="back">返回上一页</el-button>
  </div>
</template>
<script setup lang="ts">
  defineOptions({
    name: '403',
  });

  const router = useRouter();

  /**
   * 返回上一页
   */
  const back = () => {
    router.go(-1);
  };
</script>

<style scoped>
  @import url(./style.less);
</style>
