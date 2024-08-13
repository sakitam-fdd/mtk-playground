<template>
  <div class="container-error">
    <el-result class="content" sub-title="抱歉，服务器出了点问题～">
      <template #extra>
        <el-button key="back" type="primary" @click="back">返回</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup lang="ts">
  const router = useRouter()
  const back = () => {
    router.go(-1)
  }
</script>

<style scoped>
  .container-error {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .content {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
