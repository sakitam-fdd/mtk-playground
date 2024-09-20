<template>
  <div class="main-layout">
    <router-view></router-view>
  </div>
</template>
<script lang="ts" setup></script>

<style lang="less">
  .main-layout {
    @apply wh-full;

    &::before {
      position: fixed;
      top: 0;
      content: ' ';
      width: 100vw;
      height: 100vh;
      background: url('@/assets/image/ball-wed.svg') no-repeat center center;
      background-size: cover;
      z-index: -1;
    }
  }
</style>
