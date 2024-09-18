import { defineComponent, ExtractPropTypes } from 'vue';

const ListProps = {
  text: String,
};

type ListPropsType = ExtractPropTypes<typeof ListProps>;

export const List = defineComponent({
  props: ListProps,
  setup(props: ListPropsType, ctx) {
    return () => (
      <p className="mb-5 flex items-center text-lg font-medium text-body-color">
        <span className="mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-md bg-primary bg-opacity-10 text-primary">
          <span class="i-icon-check" />
        </span>
        {props.text}
      </p>
    );
  },
});

const selectionItemProps = {
  title: String,
  paragraph: String,
  center: Boolean,
  width: String,
  mb: String,
};

type SelectionItemPropsType = ExtractPropTypes<typeof selectionItemProps>;

export default defineComponent({
  props: selectionItemProps,
  setup(props: SelectionItemPropsType, ctx) {
    return () => (
      <section id="about" className="pt-16 md:pt-20 lg:pt-28">
        <div className="container">
          <div className="border-b border-body-color/[.15] pb-16 dark:border-white/[.15] md:pb-20 lg:pb-28">
            <div className="-mx-4 flex flex-wrap items-center">
              <div className="w-full px-4 lg:w-1/2">
                <div
                  className={`w-full ${center ? 'mx-auto text-center' : ''}`}
                  style={{ maxWidth: width, marginBottom: mb }}
                >
                  <h2 className="mb-4 text-3xl font-bold !leading-tight text-black dark:text-white sm:text-4xl md:text-[45px]">
                    {title}
                  </h2>
                  <p className="text-base !leading-relaxed text-body-color md:text-lg">{paragraph}</p>
                </div>

                <div className="mb-12 max-w-[570px] lg:mb-0" data-wow-delay=".15s">
                  <div className="mx-[-12px] flex flex-wrap">
                    <div className="w-full px-3 sm:w-1/2 lg:w-full xl:w-1/2">
                      <List text={t('col-one.1')} />
                      <List text={t('col-one.2')} />
                    </div>

                    <div className="w-full px-3 sm:w-1/2 lg:w-full xl:w-1/2">
                      <List text={t('col-two.1')} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full px-4 lg:w-1/2">
                <a href="https://www.animegirl.studio/" target="_blank" rel="noopener noreferrer">
                  <div className="relative mx-auto aspect-[360/266] max-w-[500px] lg:mr-0 hover:opacity-80">
                    <image
                      src="/images/about/animegirl.jpg"
                      alt="animegirl"
                      fill
                      className="mx-auto max-w-full drop-shadow-three dark:drop-shadow-none lg:mr-0"
                    />
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  },
});
