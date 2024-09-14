<template>
  <header class="w-full" :class="{ fixed: isSticky }">
    <nav class="bg-white/30 dark:bg-gray-900 w-full top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="" class="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/logo.png" class="h-12" alt="Flowbite Logo" />
          <span class="self-center hidden md:block text-2xl font-semibold whitespace-nowrap dark:text-white">
            XIAOBIN
          </span>
        </a>
        <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <label class="inline-flex items-center me-5 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              class="text-sm font-medium text-gray-900 dark:text-gray-300"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <path
                d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
              />
            </svg>
            <input type="checkbox" :checked="isDark" @change="toggleTheme" class="sr-only peer" />
            <div
              class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
            ></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              class="text-sm font-medium text-gray-900 dark:text-gray-300"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </label>

          <button
            @click="toggleMenu"
            type="button"
            class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            :aria-expanded="isMenuOpen"
          >
            <span class="sr-only">Open main menu</span>
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
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

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useTheme } from '@/hooks/useTheme';

  const { isDark } = useTheme();
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

<style scoped>
  .fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    backdrop-filter: blur(16px);
  }

  nav {
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
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
