import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SelectionItem',
  props: {
    title: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    link: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    return () => (
      <div class="w-full px-4 md:w-1/2 lg:w-1/3">
        <div class="mx-auto mb-10 max-w-[370px] rounded-lg bg-white p-8 shadow-lg hover:shadow-xl"> {/* 1 */}
      </div>
      )
    );
  },
});
