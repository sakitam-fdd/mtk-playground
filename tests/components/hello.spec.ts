import { expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import Tooltip from '@/components/Tooltip/index.vue'

test('displays message', () => {
  const wrapper = mount(Tooltip, {
    props: {
      content: 'Hello world'
    }
  })

  // Assert the rendered text of the component
  expect(wrapper.text()).toContain('Hello world')
})
