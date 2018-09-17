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
        <div ref="theadMiddle"
             class="table__header-middle"
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
      </div>
      <!-- 表头部分 -->

      <!-- 表格部分 -->
      <div class="infinity-table__body"
           :style="tbodyStyle">
        <div ref="tbodyLeft"
             class="table__body-left"
             :style="{ height: height - $refs.thead.clientHeight + 'px' }"
             v-if="showLeftFixed">
          <div ref="tbodyLeftScroll"
               class="table__body-containner">
            <div :style="tbodyLeftStyle">
              <div v-for="row in rowData"
                   class="infinity-table__row"
                   :class="{ 'hover': hoverIndex === row.id }"
                   :key="`tbody_left-row${row.id}`"
                   :style="renderRowPosition(row.id)"
                   @mouseenter="onMouseEnter(row.id)"
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
             :style="{ height: height - $refs.thead.clientHeight + 'px' }"
             v-if="showRightFixed">
          <div class="table__body-containner"
               ref="tbodyRightScroll">
            <div :style="tbodyRightStyle">
              <div v-for="row in rowData"
                   class="infinity-table__row"
                   :class="{ 'hover': hoverIndex === row.id }"
                   :key="`tbody_right-row${row.id}`"
                   :style="renderRowPosition(row.id)"
                   @mouseenter="onMouseEnter(row.id)"
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
               style="overflow: auto; height: 100%; scroll-behavior: smooth;">
            <div class="table__body-containner"
                 :style="{ height: viewHeight + 'px' }">
              <div v-for="row in rowData"
                   class="infinity-table__row"
                   :class="{ 'hover': hoverIndex === row.id }"
                   :key="`row_${row.id}`"
                   :style="renderRowPosition(row.id)"
                   @mouseenter="onMouseEnter(row.id)"
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
      <div class="infinity-table__foot">
        <div class="table__foot-left"></div>
        <div class="table__foot-middle"></div>
        <div class="table__foot-right"></div>
      </div>
      <!-- 表格底部 -->

    </div>
  </div>

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class InfinityTable extends Vue {
  // table的动态样式
  get tableStyle() {
    return {
      height: this.height ? this.height + 'px' : 'auto',
    }
  }

  // 列定义内容
  get columns() {
    return this.columnDefs.filter((x) => !x.fixed)
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
    return this.leftColumnDefs.map((x) => x.width).reduce((w1, w2) => w1 + w2, 0)
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
    return this.rightColumnDefs.map((x) => x.width).reduce((w1, w2) => w1 + w2, 0)
  }

  // 视图高度
  get viewHeight(): number {
    return this.data.length * this.rowHeight
  }

  // $refs declare
  public $refs!: {
    thead: Element
    tbody: Element
    tbodyLeft: Element
    tbodyRight: Element
    tbodyLeftScroll: HTMLElement
    tbodyRightScroll: HTMLElement,
  }
  // data
  @Prop({ default: 0 })
  private height!: number

  @Prop({ default: () => [] })
  private data!: any[]

  @Prop({ default: () => [] })
  private columnDefs!: any[]

  @Prop({ default: 38 })
  private rowHeight!: number

  @Prop({ default: false })
  private hover!: boolean

  private rowData: any[] = []
  private scrollAnchor: number = 0
  private timer: any = null

  private tbodyStyle = {
    height: 'auto',
    top: '0',
  }
  private tbodyMiddleViewStyle = {
    position: 'relative',
    marginRight: '0',
  }
  private theadMiddleWrapStyle = {}
  private theadMiddleStyle = {
    position: 'relative',
    left: '0',
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
        this.rowData.push(row)
      }
    }
    this.updateRenderRowIndex()
    this.renderTableHeader()
    this.renderTableBody()
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
    this.theadMiddleWrapStyle = {
      marginRight: this.colFixedRightWidth
        ? `${this.colFixedRightWidth}px`
        : '0px',
    }
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

  public compile(template: string) {
    return Vue.compile(template)
  }

  /**
   * 渲染行的位置
   */
  private renderRowPosition(id: number) {
    return {
      transform: `translateY(${id * this.rowHeight}px)`,
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
    this.theadMiddleStyle.left = -el.scrollLeft + 'px'
    if (this.$refs.tbodyLeftScroll) {
      this.$refs.tbodyLeftScroll.style.top = -el.scrollTop + 'px'
    }
    if (this.$refs.tbodyRightScroll) {
      this.$refs.tbodyRightScroll.style.top = -el.scrollTop + 'px'
    }
    this.updateRenderRowIndex()
  }

  /**
   * 更新所有需要显示行数的下标数组
   */
  private updateRenderRowIndex() {
    let index = Math.floor(this.$refs.tbody.scrollTop / this.rowHeight)
    const showCount = this.getShowRowCount()
    const count = index + showCount
    const indexArr: number[] = []
    for (index; index < count; index++) {
      indexArr.push(index)
    }
    this.rowData = this.data.filter((x, i) => indexArr.includes(x.id))
    this.scrollAnchor = this.$refs.tbody.scrollTop
  }
}
</script>

<style lang="scss">
$border-color: #ebeef5;
$hover-color: #f5f7fa;

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
  display: block;
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
  background-color: #f5f7f7;
  color: rgba(0, 0, 0, 0.54);

  .table__header-left,
  .table__header-middle,
  .table__header-right {
    display: inline-block;
    box-sizing: border-box;
    height: 100%;
    overflow: hidden;
  }

  .table__header-middle {
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
    scroll-behavior: smooth;
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
</style>
