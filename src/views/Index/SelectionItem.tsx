import { defineComponent, ExtractPropTypes } from 'vue';
import st from './index.module.less';

const ListProps = {
  text: String,
};

type ListPropsType = ExtractPropTypes<typeof ListProps>;

export const List = defineComponent({
  props: ListProps,
  setup(props: ListPropsType, ctx) {
    return () => (
      <p class={[st.featureItem, 'dark:text-white']}>
        <span class={[st.featureItemIcon]}>
          <svg width="16" height="13" viewBox="0 0 16 13" class="fill-current">
            <path d="M5.8535 12.6631C5.65824 12.8584 5.34166 12.8584 5.1464 12.6631L0.678505 8.1952C0.483242 7.99994 0.483242 7.68336 0.678505 7.4881L2.32921 5.83739C2.52467 5.64193 2.84166 5.64216 3.03684 5.83791L5.14622 7.95354C5.34147 8.14936 5.65859 8.14952 5.85403 7.95388L13.3797 0.420561C13.575 0.22513 13.8917 0.225051 14.087 0.420383L15.7381 2.07143C15.9333 2.26669 15.9333 2.58327 15.7381 2.77854L5.8535 12.6631Z" />
          </svg>
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
  features: Array<{ text: string }>,
  link: String,
  image: String,
  alt: String,
  direction: String,
};

type SelectionItemPropsType = ExtractPropTypes<typeof selectionItemProps>;

export default defineComponent({
  props: selectionItemProps,
  setup(props: SelectionItemPropsType, ctx) {
    return () => (
      <section id="about" class="pt-16 md:pt-20 lg:pt-28">
        <div class="container">
          <div class="border-b border-body-color/[.15] pb-16 dark:border-white/[.15] md:pb-20 lg:pb-28">
            <div class="-mx-4 flex flex-wrap items-center">
              {props.direction === 'left' ? (
                <div class="w-full px-4 lg:w-1/2">
                  <a href={props.link} target="_blank" rel="noopener noreferrer">
                    <div class="relative mx-auto aspect-[360/266] max-w-[500px] lg:ml-0 hover:opacity-80">
                      <img
                        src={props.image}
                        alt={props.alt}
                        class="mx-auto max-w-full drop-shadow-three dark:drop-shadow-none"
                      />
                    </div>
                  </a>
                </div>
              ) : null}
              <div class="w-full px-4 lg:w-1/2">
                <div
                  class={`w-full ${props.center ? 'mx-auto text-center' : ''}`}
                  style={{ maxWidth: props.width, marginBottom: props.mb }}
                >
                  <h2 class="mb-4 text-3xl font-bold !leading-tight text-black dark:text-white sm:text-4xl md:text-[45px]">
                    {props.title}
                  </h2>
                  <p class="text-base !leading-relaxed dark:text-white text-body-color md:text-lg">{props.paragraph}</p>
                </div>

                <div class="mb-12 mt-12 max-w-[100%] lg:mb-0">
                  <div class="mx-[-12px] flex flex-wrap">
                    <div class="flex flex-wrap w-full px-3 sm:w-full lg:w-full xl:w-full">
                      {props.features.map((item) => (
                        <List key={item.text} text={item.text} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {props.direction !== 'left' ? (
                <div class="w-full px-4 lg:w-1/2">
                  <a href={props.link} target="_blank" rel="noopener noreferrer">
                    <div class="relative mx-auto aspect-[360/266] max-w-[500px] lg:mr-0 hover:opacity-80">
                      <img
                        src={props.image}
                        alt={props.alt}
                        class="mx-auto max-w-full drop-shadow-three dark:drop-shadow-none lg:mr-0"
                      />
                    </div>
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    );
  },
});
