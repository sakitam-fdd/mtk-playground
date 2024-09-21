import { expect, test } from 'vitest';
import { mount } from '@vue/test-utils';
import ScrollTop from '@/components/ScrollTop/index.vue';

test('displays message', () => {
  const wrapper = mount(ScrollTop, {
    props: {
      content: 'Hello world',
    },
  });

  // Assert the rendered text of the component
  expect(wrapper.text()).toContain('Hello world');
});
