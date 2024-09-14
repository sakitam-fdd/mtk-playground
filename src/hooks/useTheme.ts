import { onMounted } from 'vue';
import { useDark } from '@vueuse/core';

const isAppearanceTransition =
  document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

type Theme = 'dark' | 'light';

const theme = ref<Theme>('dark');

export const useTheme = () => {
  const isDark = useDark();

  const toggleTheme = (d: boolean) => {
    theme.value = d ? 'dark' : 'light';
  };

  const setTheme = (t: Theme) => {
    theme.value = t;
    isDark.value = theme.value === 'dark';
  };

  function toggleDark(event?: MouseEvent) {
    if (!isAppearanceTransition || !event) {
      isDark.value = !isDark.value;
      toggleTheme(isDark.value);
      return;
    }
    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    // @ts-expect-error: Transition API
    const transition = document.startViewTransition(async () => {
      isDark.value = !isDark.value;
      toggleTheme(isDark.value);
      await nextTick();
    });
    transition.ready.then(() => {
      const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];
      document.documentElement.animate(
        {
          clipPath: isDark.value ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 400,
          easing: 'ease-in',
          pseudoElement: isDark.value ? '::view-transition-old(root)' : '::view-transition-new(root)',
        },
      );
    });
  }

  onMounted(() => {
    const cls = document.documentElement.classList;
    setTheme(cls.contains('dark') || window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  return { theme, isDark, setTheme, toggleDark };
};
