<template>
  <div class="infinity-table-wrapper">
    <div class="infinity-table infinity-table--border"
         :style="tableStyle">

      <!-- 表头部分 -->
      <div ref="thead"
           class="infinity-table__header">
        <div ref="theadFixLeft"
             class="table__header--fix-left"
             v-show="showHeadLeftFixed">
          <div class="infinity-table__row">
            <div class="infinity-table__cell header-label"
                 v-for="(column, i) in colFixedLeft"
                 :key="`column_header-fixLeft-${i}`"
                 :style="getColStyle(column)">
              <span>{{ column.title }}</span>
            </div>
          </div>
        </div>
        <div class="table__header--viewport"
             :style="headerViewPort">
          <div class="infinity-table__row">
            <div class="infinity-table__cell header-label"
                 v-for="(column, i) in columns"
                 :key="`column_header-${i}`"
                 :style="getColStyle(column)">
              <span>{{ column.title }}</span>
            </div>
          </div>
        </div>
        <div ref="theadFixRight"
             class="table__header--fix-right"
             v-show="showHeadRightFixed">
          <div class="infinity-table__row">
            <div class="infinity-table__cell header-label"
                 v-for="(column, i) in colFixedRight"
                 :key="`column_header-fixRight-${i}`"
                 :style="getColStyle(column)">
              <span>{{ column.title }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 表头部分 -->

      <!-- 表格部分 -->
      <div class="infinity-table__body"
           ref="body"
           :style="tbodyStyle"
           @scroll="onScroll">
        <div class="table__body--fix-left"></div>
        <div class="table__body--viewport"
             :style="{ height: data.length * 38 + 'px' }">
          <div class="infinity-table__row"
               v-for="row in dataView"
               :key="`row_${row.id}`"
               :style="{ position: 'absolute', transform: `translateY(${row.id * 38}px)`}">
            <div v-for="(column, i) in columnDefs"
                 :key="`column_cell-${i}`"
                 :style="getColStyle(column)"
                 class="infinity-table__cell">
              <span :title="row[column.filed]">{{ row[column.filed] }}</span>
            </div>
          </div>
        </div>
        <div class="table__body--fix-right"></div>
      </div>
      <!-- 表格部分 -->

      <!-- 表格底部 -->
      <div class="infinity-table__foot">
        <div class="table__foot--fix-left"></div>
        <div class="table__foot--viewport"></div>
        <div class="table__body--fix-right"></div>
      </div>
      <!-- 表格底部 -->

    </div>
  </div>

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class InfinityTable extends Vue {
  @Prop({ default: 0 })
  private height!: number

  @Prop({ default: () => [] })
  private data!: any[]

  @Prop({ default: () => [] })
  private columnDefs!: any[]

  private rowNodes: Element[] = []
  private dataView: any[] = []
  private scrollAchor: number = 0
  private headerViewPort = {}
  private tbodyStyle = {}
  private timer: any = null

  private showHeadRightFixed: boolean = false

  // table的动态样式
  get tableStyle() {
    return {
      height: this.height ? this.height + 'px' : '100vh',
    }
  }

  get columns() {
    return this.columnDefs.filter((x) => !x.fixed)
  }

  get colFixedLeft() {
    return this.columnDefs.filter((x) => x.fixed && x.fixed === 'left')
  }

  get showHeadLeftFixed(): boolean {
    return Boolean(this.colFixedLeft.length)
  }

  get colFixedRight() {
    return this.columnDefs.filter((x) => x.fixed && x.fixed === 'right')
  }

  get viewEl(): Element {
    return this.$refs.body as Element
  }

  // 显示行数
  public getShowRowCount(): number {
    return Math.ceil(this.height / 39)
  }

  // 行样式
  public getRowStyle(index: number) {
    return {
      // transform: `translateY(${index * 34}px)`
    }
  }

  // 单元格样式
  public getColStyle(column: any) {
    const style = {
      width: '',
      minWidth: '',
    }
    if (column.width) {
      style.width = `${column.width + 'px'}`
    } else if (column.minWidth) {
      style.minWidth = column.minWidth + 'px'
    } else {
      style.minWidth = 'fit-content'
    }
    return style
  }

  // 组件生命周期
  public async mounted() {
    await this.$nextTick()
    const count = this.getShowRowCount()
    for (let index = 0; index < count; index++) {
      const row = this.data.findIndex((x) => x === index)
      if (row) {
        this.dataView.push(row)
      }
    }
    this.updateRenderRowIndex()
    this.renderTableHeader()
    this.renderTableBody()

    // let observer = new window.ResizeObserver(this.onResize)
    // observer.observe(<Element>this.$refs.table)
  }

  public renderTableHeader() {
    const theadFixLeft = this.$refs.theadFixLeft as HTMLElement
    this.headerViewPort = {
      marginLeft: theadFixLeft ? `${theadFixLeft.scrollWidth}px` : '0px',
    }
  }

  public renderTableBody() {
    const thead = this.$refs.thead as HTMLElement
    this.tbodyStyle = {
      height: this.height ? this.height - thead.clientHeight + 'px' : '100vh',
      overflowY: 'auto',
      overflowX: 'auto',
      top: thead ? thead.clientHeight : '38px',
    }
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
    }, 20)
  }

  /**
   * 更新所有需要显示行数的下标数组
   */
  private updateRenderRowIndex() {
    let index = Math.floor(this.viewEl.scrollTop / 38)
    const showCount = this.getShowRowCount()
    const count = index + showCount
    const indexArr: number[] = []
    for (index; index < count; index++) {
      indexArr.push(index)
    }
    this.dataView = this.data.filter((x, i) => indexArr.includes(x.id))
    this.scrollAchor = this.viewEl.scrollTop
  }
}
</script>

<style lang="scss">
$border-color: #ebeef5;

@mixin ellipsis {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.infinity-table-wrapper {
  overflow: hidden;

  * {
    box-sizing: border-box;
  }
}

.infinity-table {
  height: 100%;
  overflow: hidden;
  position: relative;
}

.infinity-table__cell {
  display: block;
  height: 100%;
  width: 100%;
  padding: 8px 12px;

  @include ellipsis;
}

.infinity-table__row {
  display: flex;
  white-space: nowrap;
  width: 100%;
  min-height: 34px;
}

.infinity-table__header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  background-color: #f5f7f7;
  color: rgba(0, 0, 0, 0.54);

  .table__header--fix-left,
  .table__header--viewport,
  .table__header--fix-right {
    display: inline-block;
    box-sizing: border-box;
    height: 100%;
    overflow: hidden;
  }

  .table__header--viewport {
    display: block;

    .infinity-table__row {
      margin-left: -1px;
    }
  }

  .table__header--fix-left {
    float: left;
  }

  .table__header--fix-right {
    float: right;
  }

  &.fixed {
    position: fixed;
  }
}

.infinity-table__body {
  position: absolute;
  top: 38px;
  left: 0;
  width: 100%;
}

.infinity-table--border {
  border: 1px solid $border-color;

  .infinity-table__cell {
    border-bottom: 1px solid $border-color;
    border-left: 1px solid $border-color;
    &:first-child {
      border-left: none;
    }
  }

  .infinity-table__cell {
    border-bottom: 1px solid $border-color;
    & + .infinity-table__cell {
      border-left: 1px solid $border-color;
    }
    &:first-child {
      border-left: none;
    }
  }

  .table__header--fix-left {
    border-right: 1px solid $border-color;
  }
}
</style>
