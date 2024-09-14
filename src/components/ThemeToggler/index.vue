<template>
  <div>
    <button @click="toggleDark">Toggle Theme</button>
  </div>
</template>

<script lang="ts" setup>
  import { watchEffect } from 'vue';
  import { useTheme } from '@/hooks/useTheme';

  const { isDark, toggleDark } = useTheme();

  watchEffect(() => {
    console.log(isDark);
  });
</script>
