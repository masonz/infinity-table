import { shallowMount } from '@vue/test-utils'
import InfinityTable from '@/components/InfinityTable.vue'
class TestData {
  public count: number = 0
  public data: any[] = []
  public columnDefs: any[] = []

  constructor(count: number = 10) {
    this.count = count
    this.generateData()
    this.generateColumnDefs()
  }

  private generateData() {
    this.data = []
    for (let i = 1; i <= this.count; i++) {
      this.data.push({
        id: i,
        name: `staff_${i}`,
      })
    }
  }

  private generateColumnDefs() {
    this.columnDefs = []
    if (this.data[0]) {
      Object.keys(this.data[0]).map((key) => {
        this.columnDefs.push({ filed: key, title: key })
      })
    }
  }
}

describe('Basic test', () => {
  it('Render the correct number of rows', async () => {
    const { data, columnDefs } = new TestData()
    const height = 650
    const wrapper = shallowMount(InfinityTable, {
      propsData: { data, height, columnDefs },
    })
    await wrapper.vm.$nextTick()
    expect(
      wrapper.find('.table__body-middle').findAll('.infinity-table__row').length,
    ).toEqual(data.length)
  })
})
