import { defineComponent, onBeforeMount, ExtractPropTypes } from 'vue';
import { useTheme } from '@/hooks/useTheme';
import Header from '@/components/Header/index.vue';
import { ElButton, ElIcon } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import useState from '@/hooks/useState';
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

export default defineComponent({
  name: 'PlaygroundList',
  props,
  setup(props: Props) {
    const { isDark } = useTheme();

    const [playgroundList, setPlaygroundList] = useState([]);
    const activeItem = ref({ value: '', label: '' });
    const createTemplate = () => {
      console.log('createTemplate');
    };

    const handleClickMenuItem = (item: any) => {
      console.log('handleClickMenuItem', item);
      activeItem.value = item;
    };

    const openFullscreen = () => {
      // Implement fullscreen logic
    };

    const openSettings = () => {
      // Implement settings logic
    };

    const menuItems = computed(() =>
      playgroundList.value.map((item) => ({
        value: item.id,
        label: item.title.cn,
      })),
    );

    const fetchPlaygroundList = async () => {
      const res = await getPlaygroundList();
      console.log('res', res);
      playgroundList.value = res;
    };

    onBeforeMount(async () => {
      await fetchPlaygroundList();
    });

    return () => (
      <>
        <Header />
        <section class="flex justify-center relative overflow-hidden pb-16 ">
          <div class="w-full max-w-[1500px] px-4 bg-white dark:bg-gray-dark">
            <div class="flex h-[50px] w-full items-center justify-between mt-15px mb-15px">
              <div class="flex-warp flex h-full w-full flex-1 items-center space-x-3">
                {menuItems.value.map((item) => (
                  <div
                    key={item.value}
                    class={[
                      styles.menuItem,
                      'whitespace-nowrap',
                      { [styles.activeMenu]: item.value === activeItem.value.value },
                    ]}
                    onClick={() => {
                      handleClickMenuItem(item);
                    }}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
              <div class="flex items-center">
                <ElButton type="primary" onClick={createTemplate}>
                  <ElIcon>
                    <Plus />
                  </ElIcon>
                  创建空模板
                </ElButton>
              </div>
            </div>

            <div class="min-h-[calc(100vh-420px)] w-full max-w-[1500px]">
              <div class={['h-full w-full gap-8 p-4']}>
                {playgroundList.value.map((subList) => (
                  <div>
                    {subList.examples.map((sub) => (
                      <div class={['grid h-full w-full gap-8 p-4', styles.playgroundList]}>
                        <h2 class={['col-span-full text-xl font-bold mb-4 text-black dark:text-white', styles.title]}>
                          <div class={styles.titleInner}>{sub.title.cn}</div>
                        </h2>
                        {sub.examples.map((example) => (
                          <div class={[styles.playgroundListItem, isDark.value ? styles.dark : '']}>
                            <div class={['relative flex-1 overflow-hidden rounded-md p-[12px]', styles.header]}>
                              <div class={styles.content}>
                                <div class="h-full w-full">
                                  <img
                                    v-lazy={`${THUMBNAIL_URL}${subList.name}_${sub.name}_${example.name}.webp`}
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
                                  <span>{example.title.cn}</span>
                                </div>
                              </div>
                            </div>
                            <div class="flex h-[40px] items-center justify-between px-[12px]">
                              <span class={styles.footerTitle}>{example.title.cn}</span>
                              <div class="icon__settings !h-[26px] !w-[26px]" onClick={openSettings}>
                                <div class="flex items-center justify-center rounded-md transition-all">
                                  <span
                                    class="iconify i-material-symbols:more-horiz m-1 text-black dark:text-white"
                                    style={{ fontSize: '18px' }}
                                  />
                                </div>
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
      </>
    );
  },
});
