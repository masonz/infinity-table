import { shallowMount } from '@vue/test-utils'
import InfinityTable from '@/components/InfinityTable.vue'

describe('InfinityTable.vue', () => {
  it('renders props.msg when passed', () => {
    const data = [{ id: 1, name: 'masonz' }]
    const wrapper = shallowMount(InfinityTable, {
      propsData: { data },
    })
    expect(wrapper.findAll('tr').length).toEqual(data.length + 1)
  })
})
