import { defineComponent, onBeforeMount, watchEffect, ExtractPropTypes } from 'vue';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Header from '@/components/Header/index.vue';
import { ElButton, ElIcon, ElTooltip } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import useState from '@/hooks/useState';
import ScrollTop from '@/components/ScrollTop/index.vue';
import { getPlaygroundList, THUMBNAIL_URL } from '@/api/graphql';
import styles from './index.module.less';

const props = {
  title: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
} as const;

type Props = ExtractPropTypes<typeof props>;

const ALL_FLAG = '__all';

export default defineComponent({
  name: 'PlaygroundList',
  props,
  setup(_: Props) {
    const { isDark } = useTheme();
    const router = useRouter();
    const { t } = useI18n();
    const [playgroundList, setPlaygroundList] = useState([]);
    const [activeItem, setActiveItem] = useState({ name: '', children: [] });
    const [activeSubItem, setActiveSubItem] = useState({ name: '' });

    const scrollThreshold = 80;

    const scrollToSection = (id: string) => {
      const section = document.getElementById(id);
      if (section) {
        const top = section.offsetTop - scrollThreshold;
        window.scrollTo({
          top,
          behavior: 'smooth',
        });
      }
    };

    const createTemplate = () => {
      router.push({
        name: 'Playground',
        query: {},
      });
    };

    const handleClickMenuItem = (item: any) => {
      setActiveItem(item);
      scrollToSection(item.name);
    };

    const handleClickSubMenuItem = (item: any) => {
      setActiveSubItem(item);
      scrollToSection(item.name);
    };

    const openFullscreen = () => {
      // Implement fullscreen logic
    };

    const openNew = (example, sub, subList) => {
      router.push({
        name: example.name,
      });
    };

    const menuItems = computed(() => {
      const list = playgroundList.value.map((item) => {
        const children = item.children.map((example) => ({
          name: example.name,
        }));

        children.unshift({
          name: ALL_FLAG,
        });

        return {
          name: item.name,
          children,
        };
      });

      list.unshift({
        name: ALL_FLAG,
        children: [],
      });

      return list;
    });

    const fetchPlaygroundList = async () => {
      const res = await getPlaygroundList();
      setPlaygroundList(res);
    };

    const handleJump = (example, subclass, category) => {
      router.push({
        name: 'Playground',
        query: {
          category: category.path,
          subclass: subclass.path,
          name: example.path,
        },
      });
    };

    onBeforeMount(async () => {
      await fetchPlaygroundList();
    });

    watchEffect(() => {
      console.log('playgroundList', playgroundList.value, menuItems.value);
    });

    return () => (
      <>
        <Header />
        <section class="flex justify-center relative overflow-hidden pb-16 ">
          <div class="w-full max-w-[1500px] px-4 bg-white dark:bg-gray-dark">
            <div class="min-h-[50px] w-full items-center justify-between mt-15px mb-15px">
              <div class="flex flex-wrap w-full items-center justify-between">
                <div class="flex flex-wrap h-full w-full flex-1 items-center space-x-3 gap-10px">
                  {menuItems.value.map((item) => (
                    <div
                      key={item.name}
                      class={[
                        styles.menuItem,
                        'font-size-16px',
                        'whitespace-nowrap',
                        { [styles.activeMenu]: item.name === activeItem.value.name },
                      ]}
                      onClick={() => {
                        handleClickMenuItem(item);
                      }}
                    >
                      {t(`playgrounds.${item.name}.title`)}
                    </div>
                  ))}
                </div>
                <div class="flex items-center">
                  <ElButton type="primary" onClick={createTemplate}>
                    <ElIcon>
                      <Plus />
                    </ElIcon>
                    {t('app.actions.create_template')}
                  </ElButton>
                </div>
              </div>
              <div class="flex flex-wrap h-full w-full flex-1 items-center space-x-3 gap-10px mt-15px mb-15px">
                {activeItem.value.children.map((item) => (
                  <div
                    key={item.value}
                    class={[
                      styles.menuItem,
                      'whitespace-nowrap',
                      { [styles.activeMenu]: item.name === activeSubItem.value.name },
                    ]}
                    onClick={() => {
                      handleClickSubMenuItem(item);
                    }}
                  >
                    {item.name === ALL_FLAG
                      ? t('playgrounds.__all.title')
                      : t(`playgrounds.${item.name.split('_').join('.')}.title`)}
                  </div>
                ))}
              </div>
            </div>

            <div class="min-h-[calc(100vh-420px)] w-full max-w-[1500px]">
              <div class={['h-full w-full gap-8 p-4']}>
                {playgroundList.value.map((subList) => (
                  <div id={subList.name}>
                    {subList.children.map((sub) => (
                      <div id={sub.name} class={['grid h-full w-full gap-8 p-4', styles.playgroundList]}>
                        <h2 class={['col-span-full text-xl font-bold mb-4 text-black dark:text-white', styles.title]}>
                          <div class={styles.titleInner}>{t(`playgrounds.${sub.name.split('_').join('.')}.title`)}</div>
                        </h2>
                        {sub.children.map((example) => (
                          <div id={example.name} class={[styles.playgroundListItem, isDark.value ? styles.dark : '']}>
                            <div
                              class={['relative flex-1 overflow-hidden rounded-md p-[12px]', styles.header]}
                              onClick={() => handleJump(example, sub, subList)}
                            >
                              <div class={styles.content}>
                                <div class="h-full w-full">
                                  <img
                                    v-lazy={`${THUMBNAIL_URL}${example.name}.webp`}
                                    class="rounded-md pre-image h-full w-full"
                                    alt="Loaded Image"
                                  />
                                </div>
                              </div>
                              <div class={['absolute left-0 top-0 h-full w-full p-[12px]', styles.mask]}>
                                <div
                                  class="flex items-center justify-center rounded-md transition-all hover:bg-[#ffffff1f] button-icon absolute right-3 top-3"
                                  onClick={openFullscreen}
                                />
                                <div class="flex h-full w-full items-center justify-center text-black dark:text-white">
                                  <span>{t(`playgrounds.${example.name.split('_').join('.')}`)}</span>
                                </div>
                              </div>
                            </div>
                            <div class="flex h-[40px] items-center justify-between px-[12px]">
                              <div class={[styles.footerTitle, 'text-overflow']}>
                                {t(`playgrounds.${example.name.split('_').join('.')}`)}
                              </div>
                              <div class="flex items-center gap-6px">
                                <ElTooltip content={t('app.actions.openNew')}>
                                  <div
                                    class="icon__settings !h-[26px] !w-[26px] text-black dark:text-white hover:color-primary hover:scale-110 cursor-pointer"
                                    onClick={() => openNew(example, sub, subList)}
                                  >
                                    <div class="flex items-center justify-center rounded-md transition-all">
                                      <span
                                        class="iconify i-material-symbols:open-in-new m-1"
                                        style={{ fontSize: '18px' }}
                                      />
                                    </div>
                                  </div>
                                </ElTooltip>
                                <ElTooltip content={t('app.actions.sfc')}>
                                  <div
                                    class="icon__settings !h-[26px] !w-[26px] text-black dark:text-white cursor-pointer hover:color-primary hover:scale-110"
                                    onClick={() => handleJump(example, sub, subList)}
                                  >
                                    <div class="flex items-center justify-center rounded-md transition-all">
                                      <span
                                        class="iconify i-material-symbols:deployed-code m-1"
                                        style={{ fontSize: '18px' }}
                                      />
                                    </div>
                                  </div>
                                </ElTooltip>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <ScrollTop />
      </>
    );
  },
});
