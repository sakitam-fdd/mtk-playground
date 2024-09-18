<template>
  <header class="w-full" :class="{ fixed: isSticky }">
    <nav class="nav">
      <div class="nav-content">
        <a href="" class="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="@/assets/icon/logo.svg" class="h-12" alt="maptalks Logo" />
          <span class="name">Maptalks</span>
        </a>
        <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <el-tooltip :content="isDark ? '亮色' : '暗色'">
            <el-button type="text" title="Toggle dark mode" class="toggle-dark" @click="toggleDark">
              <span v-if="!isDark" class="i-ant-design:sun-outlined icon-size"></span>
              <span v-else class="i-ant-design:moon-outlined icon-size"></span>
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
  <section
    id="home"
    class="relative z-10 overflow-hidden bg-white pb-16 pt-[120px] dark:bg-gray-dark md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[200px] 2xl:pt-[210px]"
  >
    <div class="page-container">
      <div class="-mx-4 flex flex-wrap">
        <div class="w-full px-4">
          <div class="mx-auto max-w-[800px] text-center">
            <h1
              class="mb-5 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight"
            >
              maptalks
            </h1>
            <p
              class="mb-12 text-base !leading-relaxed text-body-color dark:text-body-color-dark sm:text-lg md:text-xl"
            >
              选择MapTalks WebGIS方案，即刻获得: 基于PBR材质的三维地图设计能力 矢量瓦片/倾斜摄影 全新渲染技术
              项目开发效率提升三倍以上
            </p>
            <div class="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <a
                href="https://github.com/maptalks/maptalks.js"
                target="_blank"
                rel="noopener noreferrer"
                title="Star on GitHub"
                class="inline-block rounded-sm bg-black px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-black/90 dark:bg-white/10 dark:text-white dark:hover:bg-white/5"
              >
                Star on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useTheme } from '@/hooks/useTheme';

  const { isDark, toggleDark } = useTheme();
  const isMenuOpen = ref(false);

  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };

  // 吸顶
  const isSticky = ref(false);
  const scrollThreshold = 80;
  const navHeight = ref(0);

  // 锚点跳转
  const currentSection = ref('section-home');

  const handleScroll = () => {
    isSticky.value = window.scrollY > scrollThreshold;

    // 锚点跳转
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY + 80; // 调整高亮的触发位置
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    const scrollHeight = document.documentElement.scrollHeight;

    const isAtBottom = scrollTop + clientHeight >= scrollHeight;

    sections.forEach((section, index) => {
      if (isAtBottom && index === sections.length - 1) {
        // currentSection.value = section.id;
        // 获取最后一个section的id，并跳转到该section
        currentSection.value = sections[index].id;
      } else if (section.offsetTop <= scrollPosition && section.offsetTop + section.clientHeight > scrollPosition) {
        currentSection.value = section.id;
      }
    });
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      const myTop = section.offsetTop - scrollThreshold;
      window.scrollTo({
        top: myTop,
        behavior: 'smooth',
      });
    }
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

  .nav {
    @apply bg-white/30 dark:bg-gray-900 w-full top-0 start-0 border-b border-gray-200 dark:border-gray-600;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);

    &-content {
      @apply max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4;

      .name {
        @apply self-center hidden md:block text-2xl font-semibold whitespace-nowrap dark:text-white;
      }
    }

    .icon-size {
      font-size: 26px;
    }
  }

  @supports not (backdrop-filter: blur(8px)) {
    nav {
      background-color: rgba(255, 255, 255, 0.9) !important;
    }
  }

  .activate {
    /* 设置字体颜色 */
    color: rgb(26 86 219 / var(--tw-text-opacity)) !important;
  }
</style>
