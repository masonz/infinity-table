<template>
  <div class="infinity-table-wrapper">
    <div class="infinity-table infinity-table--border"
         :style="tableStyle">

      <!-- 表头部分 -->
      <div ref="thead"
           class="infinity-table__header">
        <div ref="theadLeft"
             class="table__header-left"
             v-show="showLeftFixed">
          <div class="infinity-table__row">
            <div class="infinity-table__cell header-label"
                 v-for="(column, i) in leftColumnDefs"
                 :key="`column_header-fixLeft-${i}`"
                 :style="getColStyle(column)">
              <span>{{ column.title }}</span>
            </div>
          </div>
        </div>
        <div ref="theadRight"
             class="table__header-right"
             v-show="showRightFixed">
          <div class="infinity-table__row">
            <div class="infinity-table__cell header-label"
                 v-for="(column, i) in rightColumnDefs"
                 :key="`column_header-fixRight-${i}`"
                 :style="getColStyle(column)">
              <span>{{ column.title }}</span>
            </div>
          </div>
        </div>
        <div ref="theadMiddleWrapper"
             class="table__header-middle-wrapper">
          <div ref="theadMiddle"
               class="table__header-middle">
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
      </div>
      <!-- 表头部分 -->

      <!-- 表格部分 -->
      <div class="infinity-table__body"
           :style="tbodyStyle">

        <div ref="tbodyLeft"
             class="table__body-left"
             v-if="showLeftFixed">
          <div ref="tbodyLeftScroll"
               class="table__body-containner">
            <div :style="tbodyLeftStyle">
              <div v-for="(row, i) in rowData"
                   class="infinity-table__row"
                   :class="{ 'hover': hoverIndex === row.$index }"
                   :key="`tbody_left-row${i}`"
                   :style="renderRowPosition(row.$index)"
                   @mouseenter="onMouseEnter(row.$index)"
                   @mouseleave="onMouseLeave">
                <div v-for="(column, i) in leftColumnDefs"
                     :key="`column_cell-${i}`"
                     :style="getColStyle(column)"
                     class="infinity-table__cell">
                  <slot v-if="column.slot"
                        :name="column.filed"
                        :row="row">
                  </slot>
                  <span v-else
                        :title="row[column.filed]">
                    {{ row[column.filed] }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div ref="tbodyRight"
             class="table__body-right"
             v-if="showRightFixed">
          <div class="table__body-containner"
               ref="tbodyRightScroll">
            <div :style="tbodyRightStyle">
              <div v-for="(row, i) in rowData"
                   class="infinity-table__row"
                   :class="{ 'hover': hoverIndex === row.$index }"
                   :key="`tbody_right-row${i}`"
                   :style="renderRowPosition(row.$index)"
                   @mouseenter="onMouseEnter(row.$index)"
                   @mouseleave="onMouseLeave">
                <div v-for="(column, i) in rightColumnDefs"
                     :key="`column_cell-${i}`"
                     :style="getColStyle(column)"
                     class="infinity-table__cell">
                  <slot v-if="column.slot"
                        :name="column.filed"
                        :row="row">
                  </slot>
                  <span v-else
                        :title="row[column.filed]">
                    {{ row[column.filed] }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="table__body-middle"
             :style="tbodyMiddleViewStyle">
          <div ref="tbody"
               style="overflow: auto; height: 100%;">
            <div v-if="!data.length"
                 ref="emptyContainer"
                 class="empty-container">
              <div v-if="!$slots.empty">{{ emptyText }}</div>
              <slot name="empty"></slot>
            </div>
            <div v-else
                 class="table__body-containner"
                 :style="{ height: viewHeight + 'px' }">
              <div v-for="(row, i) in rowData"
                   class="infinity-table__row"
                   :class="{ 'hover': hoverIndex === row.$index }"
                   :key="`row_${i}`"
                   :style="renderRowPosition(row.$index)"
                   @mouseenter="onMouseEnter(row.$index)"
                   @mouseleave="onMouseLeave">
                <div v-for="(column, i) in columns"
                     :key="`column_cell-${i}`"
                     :style="getColStyle(column)"
                     class="infinity-table__cell">
                  <slot v-if="column.slot"
                        :name="column.filed"
                        :row="row">
                  </slot>
                  <span v-else
                        :title="row[column.filed]">
                    {{ row[column.filed] }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 表格部分 -->

      <!-- 表格底部 -->
      <div ref="tfoot"
           class="infinity-table__footer"
           v-show="showSummary">
        <div ref="tfootLeft"
             class="table__footer-left"
             v-show="showLeftFixed">
          <div class="infinity-table__row">
            <div class="infinity-table__cell"
                 v-for="(column, i) in leftColumnDefs"
                 :key="`column_header-fixLeft-${i}`"
                 :style="getColStyle(column)">
              <span>{{ getSummary(column) }}</span>
            </div>
          </div>
        </div>
        <div ref="tfootRight"
             class="table__footer-right"
             v-show="showRightFixed">
          <div class="infinity-table__row">
            <div class="infinity-table__cell"
                 v-for="(column, i) in rightColumnDefs"
                 :key="`column_header-fixRight-${i}`"
                 :style="getColStyle(column)">
              <span>{{ getSummary(column)}}</span>
            </div>
          </div>
        </div>
        <div ref="tfootMiddleWrapper"
             class="table__footer-middle-wrapper">
          <div ref="tfootMiddle"
               class="table__footer-middle">
            <div class="infinity-table__row">
              <div class="infinity-table__cell"
                   v-for="(column, i) in columns"
                   :key="`column_footer-${i}`"
                   :style="getColStyle(column)">
                <span>{{ getSummary(column) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 表格底部 -->

    </div>
  </div>

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class InfinityTable extends Vue {
  //#region Computed

  // table的动态样式
  get tableStyle() {
    return {
      height: this.height ? this.height + 'px' : 'auto',
    }
  }

  // 主视图的列定义内容
  get columns() {
    return this.columnDefs.filter((x) => !x.fixed)
  }

  // 主视图的列总宽度
  get columnsWidth() {
    return this.columns
      .map((x) => x.width || this.defaultWidth)
      .reduce((w1, w2) => w1 + w2, 0)
  }

  // 是否显示左侧固定布局
  get showLeftFixed(): boolean {
    return Boolean(this.leftColumnDefs.length)
  }

  // 左侧固定布局的列定义内容
  get leftColumnDefs() {
    return this.columnDefs.filter((x) => x.fixed && x.fixed === 'left')
  }

  // 左侧固定布局的总宽度
  get colFixedLeftWidth(): number {
    return this.leftColumnDefs
      .map((x) => x.width || this.defaultWidth)
      .reduce((w1, w2) => w1 + w2, '0')
  }

  // 是否显示右侧固定布局
  get showRightFixed(): boolean {
    return Boolean(this.rightColumnDefs.length)
  }

  // 右侧固定布局的列定义内容
  get rightColumnDefs() {
    return this.columnDefs.filter((x) => x.fixed && x.fixed === 'right')
  }

  // 右侧固定布局的总宽度
  get colFixedRightWidth(): number {
    return this.rightColumnDefs
      .map((x) => x.width || this.defaultWidth)
      .reduce((w1, w2) => w1 + w2, 0)
  }

  // 视图高度
  get viewHeight(): number {
    return this.data.length * this.rowHeight
  }

  // 是否显示底部合计
  get showSummary() {
    return this.summary !== false
  }

  //#endregion Computed

  //#region Data

  // $refs declare
  public $refs!: {
    thead: HTMLElement
    theadMiddle: HTMLElement
    theadMiddleWrapper: HTMLElement
    tfoot: HTMLElement
    tfootMiddle: HTMLElement
    tfootMiddleWrapper: HTMLElement
    tbody: HTMLElement
    tbodyLeft: HTMLElement
    tbodyRight: HTMLElement
    tbodyLeftScroll: HTMLElement
    tbodyRightScroll: HTMLElement
    emptyContainer: HTMLElement,
  }

  // 表格高度
  @Prop({ default: 0 })
  private height!: number

  // 表格数据
  @Prop({ default: () => [] })
  private data!: any[]

  // 列定义集合
  @Prop({ required: true })
  private columnDefs!: any[]

  // 行高
  @Prop({ default: 38 })
  private rowHeight!: number

  // 默认列宽
  @Prop({ default: 100 })
  private defaultWidth!: number

  // 是否需要鼠标悬浮高亮
  @Prop({ default: false })
  private hover!: boolean

  // 合计
  @Prop({ default: false })
  private summary!: boolean

  @Prop({ default: '暂无数据' })
  private emptyText!: string

  private rowData: any[] = []
  private scrollAnchor: number = 0
  private timer: any = null

  private tbodyStyle = {
    height: 'auto',
    top: '0',
    paddingBottom: '0',
  }
  private tbodyMiddleViewStyle = {
    position: 'relative',
    marginRight: '0',
  }
  private tbodyLeftStyle = {
    position: 'relative',
    height: 'auto',
    width: '',
  }
  private tbodyRightStyle = {
    position: 'relative',
    height: 'auto',
    width: '',
  }

  private hoverIndex: any = null

  //#endregion Data

  //#region Methods

  // 获取视图内需要渲染行的数量
  public getShowRowCount(): number {
    return Math.ceil(this.height / this.rowHeight)
  }

  // 单元格样式
  public getColStyle(column: any) {
    const style = {
      flex: `1 0 ${this.defaultWidth}px`,
      width: `${this.defaultWidth}px`,
      minWidth: '0',
    }
    if (column.width) {
      style.width = `${column.width + 'px'}`
      style.flex = `1 0 ${column.width + 'px'}`
    } else if (column.minWidth) {
      style.width = '0'
      style.minWidth = column.minWidth + 'px'
      style.flex = `1 0 ${column.minWidth + 'px'}`
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
        this.rowData.push(row)
      }
    }
    this.updateRenderRowIndex()
    this.renderTableHeader()
    this.renderTableBody()
    this.renderTableFooter()
    this.setScrollListener()

    // let observer = new window.ResizeObserver(this.onResize)
    // observer.observe(<Element>this.$refs.table)
  }

  public beforeDestroy() {
    this.$refs.tbody.removeEventListener('scroll', this.onScroll)
  }

  /**
   * 表头区域渲染
   */
  public renderTableHeader() {
    this.$refs.theadMiddleWrapper.style.marginRight = `${
      this.colFixedRightWidth
    }px`
  }

  /**
   * 表底区域渲染
   */
  public renderTableFooter() {
    this.$refs.tfootMiddleWrapper.style.marginRight = `${
      this.colFixedRightWidth
    }px`
  }

  /**
   * 表格区域渲染
   */
  public renderTableBody() {
    const thead = this.$refs.thead as HTMLElement
    if (this.showLeftFixed) {
      this.tbodyLeftStyle.width = this.colFixedLeftWidth + 'px'
      this.tbodyLeftStyle.height = `${this.viewHeight}px`
    }
    if (this.showRightFixed) {
      this.tbodyMiddleViewStyle.marginRight = this.$refs.tbodyRight
        ? `-${this.$refs.tbodyRight.clientWidth}px`
        : this.tbodyMiddleViewStyle.marginRight
      this.tbodyRightStyle.width = this.colFixedRightWidth + 'px'
      this.tbodyRightStyle.height = `${this.viewHeight}px`
    }
    this.tbodyStyle.height = this.height
      ? `${this.height - thead.clientHeight}px`
      : this.tbodyStyle.height
    this.tbodyStyle.top = thead
      ? thead.clientHeight + 'px'
      : this.tbodyStyle.top
    if (this.$refs.tfoot) {
      this.tbodyStyle.paddingBottom = this.$refs.tfoot.clientHeight + 'px'
    }
    this.$refs.tbodyLeft.style.height = this.height - thead.clientHeight + 'px'
    this.$refs.tbodyRight.style.height = this.height - thead.clientHeight + 'px'
    if (this.$refs.emptyContainer) {
      this.$refs.emptyContainer.style.minWidth = `${this.columnsWidth}px`
    }
  }

  public onMouseEnter(index: number) {
    if (this.hover === false) {
      return
    }
    this.hoverIndex = index
  }

  public onMouseLeave(event: Event) {
    if (this.hover === false) {
      return
    }
    this.hoverIndex = null
  }

  /**
   * 渲染行的位置
   */
  private renderRowPosition(index: number) {
    return {
      transform: `translateY(${index * this.rowHeight}px)`,
    }
  }

  /**
   * 设置滚动监听事件
   */
  private setScrollListener(): void {
    this.$refs.tbody.addEventListener('scroll', this.onScroll)
  }

  /**
   * 滚动事件
   */
  private onScroll(ev: Event) {
    this.hoverIndex = null
    const el = ev.target as Element
    this.updateRenderRowIndex()
    if (this.$refs.theadMiddle.style.left !== -el.scrollLeft + 'px') {
      this.$refs.theadMiddle.style.left = -el.scrollLeft + 'px'
    }
    if (this.$refs.tfootMiddle) {
      this.$refs.tfootMiddle.style.left = -el.scrollLeft + 'px'
    }
    if (this.$refs.tbodyLeftScroll) {
      this.$refs.tbodyLeftScroll.style.top = -el.scrollTop + 'px'
    }
    if (this.$refs.tbodyRightScroll) {
      this.$refs.tbodyRightScroll.style.top = -el.scrollTop + 'px'
    }
  }

  /**
   * 更新所有需要显示行数的下标数组
   */
  private updateRenderRowIndex() {
    let index = Math.floor(this.$refs.tbody.scrollTop / this.rowHeight)
    const showCount = this.getShowRowCount() + 2
    const count = index + showCount
    const indexArr: number[] = []
    for (index; index < count; index++) {
      indexArr.push(index)
    }
    this.rowData = this.data
      .filter((x, i) => indexArr.includes(i))
      .map((x, i) => ({ ...x, $index: indexArr[i] }))
    // this.scrollAnchor = this.$refs.tbody.scrollTop
  }

  /**
   * 获取合计值
   * @param {any} column
   * @returns string | number
   */
  private getSummary(column: any): string | number {
    if (column.summary !== undefined) {
      return column.summary
    }
    const summary = this.data
      .map((d) => d[column.filed])
      .reduce((d1, d2) => parseFloat(d1) + parseFloat(d2), 0)
    return isNaN(summary) || !this.data.length ? 'N/A' : summary.toFixed(2)
  }

  //#endregion Methods
}
</script>

<style lang="scss">
$border-color: #ebeef5;
$background-color: #f5f7fa;
$hover-color: #f5f7fa;
$black-color: #24292e;

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
  background: inherit;

  @include ellipsis;
}

.infinity-table__row {
  display: flex;
  white-space: nowrap;
  width: 100%;
  height: 38px;

  &.hover .infinity-table__cell {
    transition: background-color 0.25s;
    background-color: $hover-color;
  }
}

.infinity-table__header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  background-color: $background-color;
  color: rgba(0, 0, 0, 0.54);

  .table__header-left,
  .table__header-middle-wrapper,
  .table__header-right {
    display: inline-block;
    box-sizing: border-box;
    height: 100%;
    overflow: hidden;
  }

  .table__header-middle-wrapper {
    display: block;
  }

  .table__header-left {
    float: left;
    border-right: 1px solid $border-color;
  }

  .table__header-right {
    float: right;
    border-left: 1px solid $border-color;
  }

  .infinity-table__cell {
    color: $black-color;
    font-weight: bold;
  }

  .table__header-middle {
    position: relative;
  }
}

.infinity-table__body {
  position: absolute;
  width: 100%;

  .table__body-left,
  .table__body-middle,
  .table__body-right {
    display: inline;
    box-sizing: border-box;
    overflow: hidden;
  }

  .table__body-middle {
    display: block;
    overflow: auto;
    height: 100%;
  }

  .table__body-left {
    float: left;
    border-right: 1px solid $border-color;

    .infinity-table__row {
      width: initial;
    }
  }

  .table__body-right {
    float: right;
    border-left: 1px solid $border-color;

    .infinity-table__row {
      width: initial;
    }
  }

  .infinity-table__row {
    position: absolute;
  }

  .table__body-containner {
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
}

.infinity-table__footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  background-color: $background-color;
  color: rgba(0, 0, 0, 0.54);

  .table__footer-left,
  .table__footer-middle-wrapper,
  .table__footer-right {
    display: inline-block;
    box-sizing: border-box;
    height: 100%;
    overflow: hidden;
  }

  .table__footer-middle-wrapper {
    display: block;
  }

  .table__footer-left {
    float: left;
    border-right: 1px solid $border-color;
  }

  .table__footer-right {
    float: right;
    border-left: 1px solid $border-color;
  }

  .infinity-table__cell {
    color: $black-color;
    border-bottom: none;
  }

  .table__footer-middle {
    position: relative;
  }
}

.empty-container {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
}
</style>
