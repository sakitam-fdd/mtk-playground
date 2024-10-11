<template>
  <header class="w-full" :class="{ fixed: isSticky }">
    <nav class="header-nav">
      <div class="header-nav-content">
        <router-link to="/" class="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="@/assets/icon/logo.svg" class="h-12" alt="maptalks Logo" />
          <span class="name">Maptalks</span>
        </router-link>
        <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <el-tooltip :content="isDark ? t('app.actions.light') : t('app.actions.dark')">
            <el-button link title="Toggle dark mode" class="toggle-dark" @click="toggleDark">
              <span v-if="!isDark" class="i-ant-design:sun-outlined icon-size"></span>
              <span v-else class="i-ant-design:moon-outlined icon-size"></span>
            </el-button>
          </el-tooltip>

          <el-tooltip
            :content="
              appStore.getLocale === LocaleEnum.ZH_CN ? t('app.actions.language') : t('app.actions.languageReverse')
            "
          >
            <el-button link title="Toggle dark mode" class="toggle-dark !ml-10px" @click="toggleLanguage">
              <div :class="['language-icon', appStore.getLocale === LocaleEnum.ZH_CN ? 'is-zh' : 'is-en']">
                <span class="language-icon-item language-icon-cn">中</span>
                <span class="language-icon-item language-icon-en">En</span>
              </div>
            </el-button>
          </el-tooltip>
        </div>
        <div
          :class="{ hidden: !isMenuOpen, block: isMenuOpen }"
          class="items-center justify-between w-full md:flex md:w-auto md:order-1"
          id="navbar-sticky"
        ></div>
      </div>
    </nav>
  </header>
  <div :style="{ height: navHeight + 'px' }" v-if="isSticky"></div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { LocaleEnum } from '@/plugins/locales';
  import { useAppStore } from '@/store/modules/app';

  const { t } = useI18n();
  const appStore = useAppStore();
  // 吸顶
  const isSticky = ref(false);
  const scrollThreshold = 80;
  const { isDark, toggleDark } = useTheme();
  const isMenuOpen = ref(false);
  const navHeight = ref(0);
  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };

  const toggleLanguage = () => {
    appStore.setLocale(appStore.getLocale === LocaleEnum.ZH_CN ? LocaleEnum.EN_US : LocaleEnum.ZH_CN);
  };

  const handleScroll = () => {
    isSticky.value = window.scrollY > scrollThreshold;
  };

  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    const nav = document.querySelector('header nav');
    if (nav) {
      navHeight.value = nav.offsetHeight;
    }
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
</script>

<style lang="less" scoped>
  .fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    backdrop-filter: blur(16px);
  }

  .header-nav {
    @apply bg-white/30 dark:bg-gray-900 w-full top-0 start-0 border-b border-gray-200 dark:border-gray-600;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);

    &-content {
      @apply max-w-1500px flex flex-wrap items-center justify-between mx-auto p-4;

      .name {
        @apply self-center hidden md:block text-2xl font-semibold whitespace-nowrap dark:text-white;
      }
    }

    .icon-size {
      font-size: 26px;
    }

    .language-icon {
      position: relative;
      width: 18px;
      height: 18px;

      &-item {
        position: absolute;
        font-size: 18px;
        line-height: 1;
        border: 1px solid var(--el-color-primary);
        color: var(--el-color-primary);
      }

      &-cn {
        inset-inline-start: -5%;
        bottom: 0;
        z-index: 0;
        transform: scale(0.5);
        transform-origin: 100% 100%;
        color: var(--el-color-primary);
      }

      &-en {
        background-color: var(--el-color-primary);
        inset-inline-end: -5%;
        top: 0;
        z-index: 1;
        transform: scale(0.7);
        transform-origin: 0 0;
        color: #ffffff;
      }

      &.is-zh {
        .language-icon-cn {
          background-color: var(--el-color-primary);
          top: 0;
          z-index: 1;
          transform: scale(0.7);
          transform-origin: 0 0;
          color: #ffffff;
        }

        .language-icon-en {
          bottom: 0;
          z-index: 0;
          transform: scale(0.5);
          transform-origin: 100% 100%;
          background-color: transparent;
          color: var(--el-color-primary);
        }
      }
    }
  }

  @supports not (backdrop-filter: blur(8px)) {
    nav {
      background-color: rgba(255, 255, 255, 0.9) !important;
    }
  }

  .toggle-dark {
    --el-button-hover-link-text-color: var(--el-color-primary);
  }

  .activate {
    /* 设置字体颜色 */
    color: rgb(26 86 219 / var(--tw-text-opacity)) !important;
  }
</style>
