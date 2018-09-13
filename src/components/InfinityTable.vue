<template>
  <div class="infinity-table-wrapper">
    <div class="infinity-table infinity-table--border"
         :style="tableStyle">

      <!-- 表头部分 -->
      <div ref="thead"
           class="infinity-table__header">
        <div ref="theadFixLeft"
             class="table__header--fix-left"
             v-show="showLeftFixed">
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
             :style="theadMiddleWrapStyle">
          <div :style="theadMiddleStyle">
            <div class="infinity-table__row">
              <div class="infinity-table__cell header-label"
                   v-for="(column, i) in columns"
                   :key="`column_header-${i}`"
                   :style="getColStyle(column)">
                <span>{{ column.title }}</span>
              </div>
            </div>
          </div>
        </div>
        <div ref="theadFixRight"
             class="table__header--fix-right"
             v-show="showRightFixed">
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
           :style="tbodyStyle">
        <div class="table__body--fix-left"
             ref="tbodyFixedLeft"
             v-if="showLeftFixed">
          <div class="table__body_containner"
               :style="tbodyLeftStyle">
            <div :style="tbodyLeftWrapStyle">
              <div class="infinity-table__row"
                   v-for="row in dataView"
                   :key="`row_${row.id}`"
                   :style="{ position: 'absolute', transform: `translateY(${row.id * rowHeight}px)`}">
                <div v-for="(column, i) in colFixedLeft"
                     :key="`column_cell-${i}`"
                     :style="getColStyle(column)"
                     class="infinity-table__cell">
                  <span :title="row[column.filed]">{{ row[column.filed] }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="table__body--viewport"
             :style="tbodyMiddleStyle">
          <div style="overflow: auto; height: 100%;"
               @scroll="onScroll"
               ref="tbody">
            <div :style="{ height: data.length * rowHeight + 'px', position: 'relative' }">
              <div class="infinity-table__row"
                   v-for="row in dataView"
                   :key="`row_${row.id}`"
                   :style="{ position: 'absolute', transform: `translateY(${row.id * rowHeight}px)`}">
                <div v-for="(column, i) in columns"
                     :key="`column_cell-${i}`"
                     :style="getColStyle(column)"
                     class="infinity-table__cell">
                  <span :title="row[column.filed]">{{ row[column.filed] }}</span>
                </div>
              </div>
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
  // data
  @Prop({ default: 0 })
  private height!: number

  @Prop({ default: () => [] })
  private data!: any[]

  @Prop({ default: () => [] })
  private columnDefs!: any[]

  @Prop({ default: 38 })
  private rowHeight!: number

  private dataView: any[] = []
  private scrollAnchor: number = 0
  private timer: any = null

  private tbodyStyle = {}
  private theadMiddleWrapStyle = {}
  private theadMiddleStyle = {
    position: 'relative',
    left: '0',
  }
  private tbodyLeftStyle = {
    top: '0',
  }
  private tbodyLeftWrapStyle = {
    position: 'relative',
    height: 'auto',
    width: '',
  }
  private tbodyMiddleStyle = {
    position: 'relative',
    marginLeft: '0',
  }

  // table的动态样式
  get tableStyle() {
    return {
      height: this.height ? this.height + 'px' : 'auto',
    }
  }

  get columns() {
    return this.columnDefs.filter((x) => !x.fixed)
  }

  get colFixedLeft() {
    return this.columnDefs.filter((x) => x.fixed && x.fixed === 'left')
  }

  get colFixedLeftWidth(): number {
    return this.colFixedLeft.map((x) => x.width).reduce((w1, w2) => w1 + w2, 0)
  }

  get showLeftFixed(): boolean {
    return Boolean(this.colFixedLeft.length)
  }

  get showRightFixed(): boolean {
    return Boolean(this.colFixedRight.length)
  }

  get colFixedRight() {
    return this.columnDefs.filter((x) => x.fixed && x.fixed === 'right')
  }

  get viewEl(): Element {
    return (this.$refs.tbody as Element) || null
  }

  get tbodyLeftEl(): Element {
    return (this.$refs.tbodyFixedLeft as Element) || null
  }

  // 获取视图内需要渲染行的数量
  public getShowRowCount(): number {
    return Math.ceil(this.height / this.rowHeight)
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
      style.width = '0px'
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

  /**
   * 表头区域渲染
   */
  public renderTableHeader() {
    this.theadMiddleWrapStyle = {
      marginLeft: this.colFixedLeftWidth ? `${this.colFixedLeftWidth}px` : '0px',
    }
  }

  /**
   * 表格区域渲染
   */
  public renderTableBody() {
    const thead = this.$refs.thead as HTMLElement
    if (this.showLeftFixed) {
      this.tbodyMiddleStyle.marginLeft = `${this.tbodyLeftEl.clientWidth}px`
      this.tbodyLeftWrapStyle.height = `${this.data.length * this.rowHeight}px`
      this.tbodyLeftWrapStyle.width = this.colFixedLeftWidth + 'px'
    }
    this.tbodyStyle = {
      height: this.height ? this.height - thead.clientHeight + 'px' : '100vh',
      top: thead ? thead.clientHeight + 'px' : '0',
    }
  }

  /**
   * 滚动事件
   */
  private onScroll() {
    this.theadMiddleStyle.left = -this.viewEl.scrollLeft + 'px'
    this.tbodyLeftStyle.top = -this.viewEl.scrollTop + 'px'
    clearInterval(this.timer)
    this.timer = setInterval(() => {
      this.updateRenderRowIndex()
      clearInterval(this.timer)
      this.timer = null
    }, 0)
  }

  /**
   * 更新所有需要显示行数的下标数组
   */
  private updateRenderRowIndex() {
    let index = Math.floor(this.viewEl.scrollTop / this.rowHeight)
    const showCount = this.getShowRowCount()
    const count = index + showCount
    const indexArr: number[] = []
    for (index; index < count; index++) {
      indexArr.push(index)
    }
    this.dataView = this.data.filter((x, i) => indexArr.includes(x.id))
    this.scrollAnchor = this.viewEl.scrollTop
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
  display: inline-block;
  height: 100%;
  width: 100%;
  padding: 8px 12px;

  @include ellipsis;
}

.infinity-table__row {
  display: block;
  white-space: nowrap;
  width: 100%;
  height: 38px;
}

.infinity-table__header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
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
}

.infinity-table__body {
  position: absolute;
  width: 100%;

  .table__body--fix-left,
  .table__body--viewport,
  .table__body--fix-right {
    display: inline;
    box-sizing: border-box;
    overflow: hidden;
  }

  .table__body--viewport {
    display: block;
    overflow: auto;
    height: 100%;

    .infinity-table__row {
      margin-left: -1px;
    }
  }

  .table__body--fix-left {
    float: left;
    height: 461px;
    border-right: 1px solid $border-color;

    .infinity-table__row {
      width: initial;
    }
  }

  .table__body--fix-right {
    float: right;
  }

  .table__body_containner {
    position: relative;
  }
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
