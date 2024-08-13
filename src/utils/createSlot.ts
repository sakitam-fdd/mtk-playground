import { defineComponent, h, ref } from 'vue';

export default (slots) =>
  defineComponent({
    setup(props, context) {
      const slotRef = ref(null);
      const [defaultSlot] = slots.default();
      // expose ref
      context.expose({
        value: slotRef,
      });
      return () => h(defaultSlot, { ref: slotRef, ...props });
    },
  });
