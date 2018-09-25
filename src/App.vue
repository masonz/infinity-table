<template>
  <div id="app">
    <infinity-table style="margin: 60px 100px;"
                    :data="data"
                    :column-defs="columnDefs"
                    :height="650"
                    hover
                    summary>
      <template slot-scope="s"
                slot="id">
        <span class="clickable"
              @click="onClick(`点击了学号${s.row.id}`)">
          {{ s.row.id }}
        </span>
      </template>
      <template slot-scope="s"
                slot="operation">
        <div>
          <span class="clickable"
                @click="onClick(`查看${s.row.name}`)">
            查看
          </span>
          <span class="clickable"
                @click="onClick(`编辑${s.row.name}`)">
            编辑
          </span>
        </div>
      </template>
      <div slot="empty">没有数据</div>
    </infinity-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import InfinityTable from './components/InfinityTable.vue'

@Component({
  components: {
    InfinityTable,
  },
})
export default class App extends Vue {
  protected data: ReadonlyArray<any> = []

  get columnDefs() {
    const colunms: any[] = []
    const keyMaps = Object.keys(this.subjectKeyMaps)
    keyMaps.forEach((key, i) => {
      const column: { [key: string]: any } = {
        filed: key,
        title: this.subjectKeyMaps[key],
        width: 100 + i * 10,
        fixed: '',
        slot: false,
      }
      if (i <= 0) {
        column.width = ''
        column.slot = true
        column.fixed = 'left'
        column.summary = '总计'
      }
      if (key === 'school') {
        column.fixed = 'right'
      }
      if (i === keyMaps.length - 1) {
        column.width = ''
        column.slot = true
        column.fixed = 'right'
      }
      colunms.push(column)
    })
    return colunms
  }

  get subjectKeyMaps(): { [key: string]: string } {
    return {
      id: '学号',
      name: '姓名',
      chinese: '语文',
      math: '数学',
      english: '英语',
      physics: '物理',
      chemistry: '化学',
      computer: '计算机',
      school: '学校',
      operation: '操作',
    }
  }

  public mounted() {
    const data: any[] = []
    for (let i = 1; i <= 10000; i++) {
      data.push({
        id: i,
        name: `学生${i}`,
        chinese: `${this.randomGrade()}`,
        math: `${this.randomGrade()}`,
        english: `${this.randomGrade()}`,
        physics: `${this.randomGrade()}`,
        chemistry: `${this.randomGrade()}`,
        computer: `${this.randomGrade()}`,
        school: `第${i}中学`,
        operation: '',
      })
    }
    this.data = Object.freeze(data)
  }

  public onClick(label: string) {
    alert(label)
  }

  private randomGrade(): string {
    return (Math.random() * 100).toFixed(2)
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.clickable {
  color: #409eff;
  cursor: pointer;
}
</style>
