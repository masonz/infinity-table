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
             class="table__header-middle-wrapper"
             :style="{ paddingRight: getPaddingRight($refs.theadMiddleWrapper) }">
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
      <div ref="tbody"
           class="infinity-table__body">
        <div ref="tbodyLeft"
             class="table__body-left"
             v-if="showLeftFixed">
          <div ref="tbodyLeftScroll"
               class="table__body-containner">
            <div ref="tbodyLeftView"
                 class="table__body-leftview">
              <div v-for="row in rowData"
                   class="infinity-table__row"
                   :class="{ 'hover': hoverIndex === row.$index }"
                   :key="`tbody_left-row${row.$index}`"
                   :style="getRowPosition(row.$index)"
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
            <div ref="tbodyRightView"
                 class="tbody__body-rightview">
              <div v-for="row in rowData"
                   class="infinity-table__row"
                   :class="{ 'hover': hoverIndex === row.$index }"
                   :key="`tbody_right-row${row.$index}`"
                   :style="getRowPosition(row.$index)"
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
        <div ref="tbodyMiddle"
             class="table__body-middle">
          <div ref="tbodyMiddleScroll"
               class="table__body-scrollview">
            <div v-if="!data.length"
                 ref="emptyContainer"
                 class="empty-container">
              <div v-if="!$slots.empty">{{ emptyText }}</div>
              <slot name="empty"></slot>
            </div>
            <div v-else
                 class="table__body-containner"
                 :style="{ height: viewHeight + 'px' }">
              <div v-for="row in rowData"
                   class="infinity-table__row"
                   :class="{ 'hover': hoverIndex === row.$index }"
                   :key="`row_${row.$index}`"
                   :style="getRowPosition(row.$index)"
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
              <span>{{ summaryData[column.filed] }}</span>
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
              <span>{{ summaryData[column.filed] }}</span>
            </div>
          </div>
        </div>
        <div ref="tfootMiddleWrapper"
             class="table__footer-middle-wrapper"
             :style="{ paddingRight: getPaddingRight($refs.theadMiddleWrapper) }">
          <div ref="tfootMiddle"
               class="table__footer-middle">
            <div class="infinity-table__row">
              <div class="infinity-table__cell"
                   v-for="(column, i) in columns"
                   :key="`column_footer-${i}`"
                   :style="getColStyle(column)">
                <span>{{ summaryData[column.filed] }}</span>
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
  get tableStyle(): object {
    return {
      height: this.height ? this.height + 'px' : 'auto',
    }
  }

  // 主视图的列定义内容
  get columns(): any[] {
    return this.columnDefs.filter((x) => !x.fixed)
  }

  // 主视图的列总宽度
  get columnsWidth(): number {
    return this.columns
      .map((x) => x.width || this.defaultWidth)
      .reduce((w1, w2) => w1 + w2, 0)
  }

  // 是否显示左侧固定布局
  get showLeftFixed(): boolean {
    return Boolean(this.leftColumnDefs.length)
  }

  // 左侧固定布局的列定义内容
  get leftColumnDefs(): any[] {
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
  get rightColumnDefs(): any[] {
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
  get showSummary(): boolean {
    return this.summary !== false
  }

  /**
   * 获取视图内显示行数
   */
  get visibleRowCount(): number {
    return Math.ceil(this.height / this.rowHeight)
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
    tbodyMiddle: HTMLElement
    tbodyLeftScroll: HTMLElement
    tbodyRightScroll: HTMLElement
    tbodyMiddleScroll: HTMLElement
    tbodyLeftView: HTMLElement
    tbodyRightView: HTMLElement
    emptyContainer: HTMLElement,
  }

  protected summaryData: { [key: string]: any } = {}

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

  // 显示合计
  @Prop({ default: false })
  private summary!: boolean

  // 空数据的文案
  @Prop({ default: '暂无数据' })
  private emptyText!: string

  // 可视数据
  private rowData: any[] = []
  // 当前悬浮行的下标
  private hoverIndex: any = null
  // 记录距离顶部滚动偏移量
  private recordScrollTop: number = 0
  // 记录距离左边滚动偏移量
  private recordScrollLeft: number = 0
  // requestAnimationFrame loop
  private loop: number = 0

  //#endregion Data

  //#region Lifecycle

  // mounted
  public async mounted() {
    await this.$nextTick()
    this.calculateTotal()
    this.updateRenderRowIndex()
    this.setHeadStyle()
    this.setBodyStyle()
    this.setFootStyle()
    this.setEmptyStyle()
    this.loop = requestAnimationFrame(this.onScroll)
    // let observer = new window.ResizeObserver(this.onResize)
    // observer.observe(<Element>this.$refs.table)
  }

  // beforeDestroy
  public beforeDestroy(): void {
    cancelAnimationFrame(this.loop)
  }

  //#endregion Lifecycle

  //#region Methods

  /**
   * 获取列样式
   * @param {*} column
   * @returns {object} style object
   */
  public getColStyle(column: any): object {
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

  /**
   * 设置表格头部样式
   */
  public setHeadStyle(): void {
    this.$refs.theadMiddleWrapper.style.marginRight = `${this.colFixedRightWidth}px`
  }

  /**
   * 设置表格底部样式
   */
  public setFootStyle(): void {
    this.$refs.tfootMiddleWrapper.style.marginRight = `${this.colFixedRightWidth}px`
  }

  /**
   * 设置空数据区域样式
   */
  public setEmptyStyle(): void {
    if (this.$refs.emptyContainer) {
      this.$refs.emptyContainer.style.minWidth = `${this.columnsWidth}px`
    }
  }

  /**
   * 设置表格样式
   */
  public setBodyStyle(): void {
    const thead = this.$refs.thead as HTMLElement
    if (this.showLeftFixed) {
      this.$refs.tbodyLeftView.style.width = this.colFixedLeftWidth + 'px'
      this.$refs.tbodyLeftView.style.height = `${this.viewHeight}px`
    }
    if (this.showRightFixed) {
      this.$refs.tbodyMiddle.style.marginRight = this.$refs.tbodyRight
        ? `-${this.$refs.tbodyRight.clientWidth}px`
        : '0'
      this.$refs.tbodyRightView.style.width = this.colFixedRightWidth + 'px'
      this.$refs.tbodyRightView.style.height = `${this.viewHeight}px`
    }
    this.$refs.tbody.style.height = this.height
      ? `${this.height - thead.clientHeight}px`
      : 'auto'
    this.$refs.tbody.style.top = thead ? thead.clientHeight + 'px' : '0'
    if (this.$refs.tfoot) {
      this.$refs.tbody.style.paddingBottom = this.$refs.tfoot.clientHeight + 'px'
    }
    this.$refs.tbodyLeft.style.height = this.height - thead.clientHeight + 'px'
    this.$refs.tbodyRight.style.height = this.height - thead.clientHeight + 'px'
  }

  /**
   * 鼠标移入
   * @param {string} index
   */
  public onMouseEnter(index: number): void {
    if (this.hover === false) {
      return
    }
    this.hoverIndex = index
  }

  /**
   * 鼠标移出
   */
  public onMouseLeave(): void {
    if (this.hover === false) {
      return
    }
    this.hoverIndex = null
  }

  /**
   * 获取行位置
   * @param {number} index
   * @returns {object} style class
   */
  private getRowPosition(index: number): object {
    return {
      transform: `translate3d(0, ${index * this.rowHeight}px ,0)`,
    }
  }

  /**
   * 获取主视图宽度，计算差距后添加右间距
   * 目前主要是滚动条的差异
   * @param {number} index
   * @returns {object} style class
   */
  private getPaddingRight(el: HTMLElement) {
    let paddingRight = ''
    if (this.$refs.tbodyMiddleScroll) {
      paddingRight = `${el.clientWidth - this.$refs.tbodyMiddleScroll.clientWidth}px`
    }
    return paddingRight
  }

  /**
   * 滚动事件
   */
  private onScroll(): void {
    this.hoverIndex = null
    const { scrollTop, scrollLeft } = this.$refs.tbodyMiddleScroll

    if (scrollLeft !== this.recordScrollLeft) {
      this.recordScrollLeft = scrollLeft
      if (this.$refs.theadMiddle.style.left !== `-${scrollLeft}px`) {
        this.$refs.theadMiddle.style.left = `-${scrollLeft}px`
      }
      if (this.$refs.tfootMiddle.style.left !== `-${scrollLeft}px`) {
        this.$refs.tfootMiddle.style.left = `-${scrollLeft}px`
      }
    }

    if (scrollTop !== this.recordScrollTop) {
      this.recordScrollTop = scrollTop
      if (this.$refs.tbodyLeftScroll) {
        this.$refs.tbodyLeftScroll.style.top = `-${scrollTop}px`
      }
      if (this.$refs.tbodyRightScroll) {
        this.$refs.tbodyRightScroll.style.top = `-${scrollTop}px`
      }
      this.updateRenderRowIndex()
    }

    this.loop = requestAnimationFrame(this.onScroll)
  }

  /**
   * 更新所有需要显示行数的下标数组
   */
  private updateRenderRowIndex(): void {
    this.rowData = []
    let startIndex = Math.floor(this.recordScrollTop / this.rowHeight)
    const endIndex = startIndex + this.visibleRowCount
    for (startIndex; startIndex <= endIndex; startIndex++) {
      this.rowData.push(Object.freeze({ ...this.data[startIndex], $index: startIndex }))
    }
  }

  /**
   * 计算合计
   */
  private calculateTotal(): void {
    this.columnDefs.map((col) => {
      if (col.summary !== undefined) {
        this.$set(this.summaryData, col.filed, col.summary)
      } else {
        const summary = this.data
          .map((d) => d[col.filed])
          .reduce((d1, d2) => parseFloat(d1) + parseFloat(d2), 0)
        const summaryVal =
          isNaN(summary) || !this.data.length ? 'N/A' : summary.toFixed(2)
        this.$set(this.summaryData, col.filed, summaryVal)
      }
    })
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
    position: relative;
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
    transform: translate3d(0, 0, 0);
  }

  .table__body-scrollview {
    height: 100%;
    overflow: auto;
    transform: translate3d(0, 0, 0);
    scroll-behavior: smooth;
    background-attachment: fixed;
  }

  .table__body-leftview,
  .table__body-rightview {
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
