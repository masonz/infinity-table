<template>
  <div class="infinity-table-wrapper">
    <div class="infinity-table infinity-table--border"
         :style="{ height: `${height}px` }">

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
                 :style="column.$style">
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
                 :style="column.$style">
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
                   :style="column.$style">
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
               class="table__body-container">
            <div ref="tbodyLeftView"
                 class="table__body-leftview">
              <div v-for="row in rowData"
                   class="infinity-table__row"
                   :class="{ 'hover': hoverIndex === row.$index }"
                   :key="`tbody_left-row${row.$index}`"
                   :style="row.$style"
                   @mouseenter="onMouseEnter(row.$index)"
                   @mouseleave="onMouseLeave">
                <div v-for="(column, i) in leftColumnDefs"
                     :key="`column_cell-${i}`"
                     :style="column.$style"
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
          <div class="table__body-container"
               ref="tbodyRightScroll">
            <div ref="tbodyRightView"
                 class="tbody__body-rightview">
              <div v-for="row in rowData"
                   class="infinity-table__row"
                   :class="{ 'hover': hoverIndex === row.$index }"
                   :key="`tbody_right-row${row.$index}`"
                   :style="row.$style"
                   @mouseenter="onMouseEnter(row.$index)"
                   @mouseleave="onMouseLeave">
                <div v-for="(column, i) in rightColumnDefs"
                     :key="`column_cell-${i}`"
                     :style="column.$style"
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
                 class="table__body-container"
                 :style="{ height: viewHeight + 'px' }">
              <div v-for="row in rowData"
                   class="infinity-table__row"
                   :class="{ 'hover': hoverIndex === row.$index }"
                   :key="`row_${row.$index}`"
                   :style="row.$style"
                   @mouseenter="onMouseEnter(row.$index)"
                   @mouseleave="onMouseLeave">
                <div v-for="(column, i) in columns"
                     :key="`column_cell-${i}`"
                     :style="column.$style"
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
                 :style="column.$style">
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
                 :style="column.$style">
              <span>{{ summaryData[column.filed] }}</span>
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
                   :style="column.$style">
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

  // 主视图的列定义内容
  get columns(): any[] {
    return this.columnDefs.filter((col) => !col.fixed).map((col) => ({
      ...col,
      $style: {
        flex: `1 0 ${col.width || this.defaultWidth}px`,
        width: `${col.width || this.defaultWidth}px`,
      },
    }))
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
    return this.columnDefs
      .filter((col) => col.fixed && col.fixed === 'left')
      .map((col) => ({
        ...col,
        $style: {
          flex: `1 0 ${col.width || this.defaultWidth}px`,
          width: `${col.width || this.defaultWidth}px`,
        },
      }))
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
    return this.columnDefs
      .filter((col) => col.fixed && col.fixed === 'right')
      .map((col) => ({
        ...col,
        $style: {
          flex: `1 0 ${col.width || this.defaultWidth}px`,
          width: `${col.width || this.defaultWidth}px`,
        },
      }))
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

  // 表格高度
  @Prop({ default: 600 })
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
  // 可见行数
  private visibleCount: number = 0
  // 当前悬浮行的下标
  private hoverIndex: any = null
  // 记录距离顶部滚动偏移量
  private recordScrollTop: number = 0
  // 记录距离左边滚动偏移量
  private recordScrollLeft: number = 0
  // requestAnimationFrame loop
  private loop: number = 0
  // 合计数据项
  private summaryData: { [key: string]: any } = {}

  //#endregion Data

  //#region Lifecycle

  // mounted
  public mounted(): void {
    this.renderTable()
  }

  // beforeDestroy
  // public beforeDestroy(): void {
  //   cancelAnimationFrame(this.loop)
  // }

  //#endregion Lifecycle

  //#region Methods

  /**
   * 渲染表格
   */
  public async renderTable() {
    await this.$nextTick()
    this.getVisibleRowCount()
    this.calculateTotal()
    this.updateRenderRowIndex()
    this.setHeadStyle()
    this.setBodyStyle()
    this.setFootStyle()
    this.setEmptyStyle()
    this.setSpacing()
    this.setScrollListener()

    // let observer = new window.ResizeObserver(this.onResize)
    // observer.observe(<Element>this.$refs.table)
  }

  /**
   * 设置间距(滚动条的间距)
   */
  public async setSpacing(): Promise<void> {
    await this.$nextTick()

    // 垂直
    const { tbodyLeft, tbodyMiddle, tbodyRight } = this.$refs
    const { offsetHeight, clientHeight, clientWidth } = tbodyMiddle
    tbodyLeft.style.paddingBottom = `${offsetHeight - clientHeight}px`
    tbodyRight.style.paddingBottom = `${offsetHeight - clientHeight}px`

    // 水平
    const { thead, tbody, tfoot } = this.$refs
    const paddingRight = tbody.offsetWidth - tbody.clientWidth
    thead.style.paddingRight = `${paddingRight}px`
    tfoot.style.paddingRight = `${paddingRight}px`
  }

  /**
   * 设置表格头部样式
   */
  public setHeadStyle(): void {
    this.$refs.theadMiddleWrapper.style.marginRight = `${
      this.colFixedRightWidth
    }px`
  }

  /**
   * 设置表格底部样式
   */
  public setFootStyle(): void {
    this.$refs.tfootMiddleWrapper.style.marginRight = `${
      this.colFixedRightWidth
    }px`
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
    const { thead, tbody, tfoot } = this.$refs
    const { tbodyLeft, tbodyRight } = this.$refs
    const { tbodyLeftView, tbodyRightView } = this.$refs
    tbody.scrollTop = 0
    tbodyLeftView.style.width = `${this.colFixedLeftWidth}px`
    tbodyLeftView.style.height = `${this.viewHeight}px`
    tbodyRightView.style.width = `${this.colFixedRightWidth}px`
    tbodyRightView.style.height = `${this.viewHeight}px`
    tbody.style.height = `${this.height - thead.clientHeight}px`
    tbody.style.height = `${tbody.clientHeight - tfoot.clientHeight}px`
    tbody.style.top = thead ? `${thead.clientHeight}px` : '0'
    tbodyLeft.style.height = this.data.length ? 'auto' : '100%'
    tbodyRight.style.height = this.data.length ? 'auto' : '100%'
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
   * 获取视图内显示行数
   */
  private getVisibleRowCount(): void {
    const { thead } = this.$refs
    const visibleHeight = this.$el.clientHeight - thead.clientHeight
    this.visibleCount = Math.ceil(visibleHeight / this.rowHeight)
  }

  /**
   * 设置滚动监听事件
   */
  private setScrollListener(): void {
    this.$refs.tbody.onscroll = (ev) => {
      requestAnimationFrame(this.onVerticalScroll)
    }
    this.$refs.tbodyMiddle.onscroll = (ev) => {
      requestAnimationFrame(this.onHorizontalScroll)
    }
  }

  /**
   * 垂直滚动事件
   */
  private onVerticalScroll(): void {
    const { tbodyMiddleScroll, tbodyMiddle } = this.$refs
    const { scrollTop } = this.$refs.tbody

    tbodyMiddle.style.height = 'auto'

    if (scrollTop !== this.recordScrollTop) {
      this.hoverIndex = null
      this.recordScrollTop = scrollTop
      tbodyMiddle.style.marginTop = `${scrollTop}px`
      tbodyMiddleScroll.style.transform = `translate3d(0, -${scrollTop}px, 0)`
      this.updateRenderRowIndex()
    }

    tbodyMiddle.style.height = '100%'
  }

  /**
   * 水平滚动事件
   */
  private onHorizontalScroll(): void {
    const { theadMiddle, tfootMiddle, tbodyMiddle } = this.$refs
    const { scrollLeft } = tbodyMiddle

    tbodyMiddle.style.height = 'auto'

    if (scrollLeft !== this.recordScrollLeft) {
      this.recordScrollLeft = scrollLeft
      theadMiddle.style.transform = `translate3d(-${scrollLeft}px, 0, 0)`
      tfootMiddle.style.transform = `translate3d(-${scrollLeft}px, 0, 0)`
    }

    tbodyMiddle.style.height = '100%'
  }

  /**
   * 更新所有需要显示行数的下标数组
   */
  private updateRenderRowIndex(): void {
    this.rowData = []
    const startIndex = Math.floor(this.recordScrollTop / this.rowHeight)
    const endIndex = startIndex + this.visibleCount
    for (let index = startIndex; index <= endIndex; index++) {
      if (this.data[index]) {
        const translateY = index * this.rowHeight
        this.rowData.push(
          Object.freeze({
            ...this.data[index],
            $index: index,
            $style: { transform: `translate3d(0, ${translateY}px ,0)` },
          }),
        )
      }
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
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;

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
    overflow-x: auto;
    overflow-y: hidden;
    height: 100%;
  }

  .table__body-left,
  .table__body-right {
    transform: translate3d(0, 0, 0);

    .infinity-table__row {
      width: initial;
    }
  }

  .table__body-left {
    float: left;
    border-right: 1px solid $border-color;
  }

  .table__body-right {
    float: right;
    border-left: 1px solid $border-color;
  }

  .infinity-table__row {
    position: absolute;
  }

  .table__body-container {
    position: relative;
    width: 100%;
  }

  .table__body-scrollview {
    width: 100%;
    height: 100%;
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
