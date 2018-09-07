<template>
  <div class="infinity-table-wrapper infinity-table--border">
    <table class="infinity-table"
           cellspacing="0"
           cellpadding="0"
           border="0">
      <div :style="tbodyStyle">
        <thead>
          <tr class="table-header">
            <th v-for="(column, i) in columns"
                :key="`column${i}`"
                class="table-header-cell">
              {{ column.title }}
            </th>
          </tr>
        </thead>
      </div>
      <div ref="tbodyWrapper"
           class="table-tbody-wrapper"
           :style="tbodyStyle"
           @scroll="onScroll">
        <tbody>
          <tr v-for="(row, i) in data"
              :key="`row_${i}`"
              class="table-row">
            <template v-if="isShowInViewPort(i)">
              <td v-for="(column, cIndex) in columns"
                  :key="`row_${i}-column_${cIndex}`"
                  class="table-body-cell">
                {{ row[column.filed] }}
              </td>
            </template>
          </tr>
        </tbody>
      </div>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class InfinityTable extends Vue {
  @Prop({ default: 0 })
  private maxHeight!: number

  @Prop({ default: () => [] })
  private data!: any[]

  @Prop({ default: () => [] })
  private columns!: any[]

  private indexArr: any[] = []
  private rowNodes: Element[] = []
  private timer: any = null

  // tbody的动态样式
  get tbodyStyle() {
    return {
      maxHeight: this.maxHeight ? this.maxHeight + 'px' : null,
      overflow: 'auto',
    }
  }

  // 组件生命周期
  public async mounted() {
    await this.$nextTick()
    this.rowNodes = Array.from(document.querySelectorAll('.table-row'))
    this.updateRenderRowIndex()
  }

  /**
   * 是否在视图显示某一行
   * @param {number} index
   * @returns boolean
   */
  private isShowInViewPort(index: number): boolean {
    return this.indexArr.includes(index)
  }

  /**
   * 滚动事件
   */
  private onScroll() {
    clearInterval(this.timer)
    this.timer = setInterval(() => {
      this.updateRenderRowIndex()
      clearInterval(this.timer)
      this.timer = null
    }, 50)
  }

  /**
   * 更新所有需要显示行数的下标数组
   */
  private updateRenderRowIndex() {
    const indexArr: any[] = []
    this.rowNodes.forEach((node, index) => {
      const isElementInView = this.isElementInViewPort(
        node as HTMLElement,
        this.$refs.tbodyWrapper as HTMLElement,
      )
      if (isElementInView) {
        indexArr.push(index)
      }
    })
    this.indexArr = indexArr
  }

  /**
   * 判断element是否在当前视图内
   * @param  {HTMLElement} el
   * @param  {HTMLElement} viewEl
   * @returns boolean
   */
  private isElementInViewPort(el: HTMLElement, viewEl: HTMLElement): boolean {
    if (!el || !viewEl) {
      return false
    }

    const curElHeight = el.clientHeight
    const viewTop = viewEl.scrollTop
    const viewBottom = viewTop + viewEl.clientHeight
    const elTop = el.offsetTop
    const elBottom = elTop + el.clientHeight

    return elTop <= viewBottom + curElHeight && elBottom >= viewTop
  }
}
</script>

<style lang="scss">
$border-color: #ebeef5;

.infinity-table-wrapper {
  overflow: auto;
  position: relative;
  display: inline-block;
}

.infinity-table {
  border-collapse: collapse;
  width: 100%;
  height: 100%;
}

.infinity-table * {
  box-sizing: border-box;
}

.table-header {
  table-layout: fixed;
}

tr {
  display: flex;
  min-height: 40px;
}

td,
th {
  padding: 0;
  margin: 0;
  min-width: 150px;
}

.table-header-cell,
.table-body-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
}

.infinity-table--border {
  border: 1px solid $border-color;

  .table-header-cell {
    border-bottom: 1px solid $border-color;
    border-left: 1px solid $border-color;
    &:first-child {
      border-left: none;
    }
  }

  .table-body-cell {
    border-bottom: 1px solid $border-color;
    & + .table-body-cell {
      border-left: 1px solid $border-color;
    }
    &:first-child {
      border-left: none;
    }
  }
}
</style>
