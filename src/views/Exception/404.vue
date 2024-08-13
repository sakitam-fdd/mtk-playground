<template>
  <div class="container-error">
    <el-result class="content" sub-title="抱歉，页面不见了～">
      <template #extra>
        <el-button key="back" type="primary" @click="back">返回上一页</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup lang="ts">
  const router = useRouter();
  const back = () => {
    router.go(-1);
  };
</script>

<style scoped>
  .container-error {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
