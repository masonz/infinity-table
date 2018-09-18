<template>
  <div id="app">
    <infinity-table style="margin: 0 100px;"
                    :data="data"
                    :column-defs="columnDefs"
                    :height="750"
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
        <span class="clickable"
              @click="onClick(`编辑${s.row.name}`)">
          编辑
        </span>
      </template>
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

  get columnDefs() {
    const colunms: any[] = []
    const firstRow = this.data.find((row) => row.id === 1)
    if (firstRow) {
      const keyMaps = Object.keys(firstRow)
      keyMaps.forEach((key, i) => {
        const column: { [key: string]: any } = {
          filed: key,
          title: this.subjectKeyMaps[key],
          width: 100 + i * 20,
          fixed: '',
          slot: false,
        }
        if (i <= 0) {
          column.width = ''
          column.slot = true
          column.fixed = 'left'
          column.summary = '总计'
        }
        if (i === keyMaps.length - 1) {
          column.width = ''
          column.slot = true
          column.fixed = 'right'
        }
        colunms.push(column)
      })
    }
    return colunms
  }

  get subjectKeyMaps(): { [key: string]: string } {
    return {
      id: '学号',
      name: '姓名',
      chinese: '语文',
      math: '数学',
      english: '英语',
      school: '学校',
      operation: '操作',
    }
  }
  protected data: any[] = []

  public mounted() {
    this.data = []
    for (let i = 0; i < 500; i++) {
      this.data.push({
        id: i,
        name: `学生${i + 1}`,
        chinese: `${this.randomGrade()}`,
        math: `${this.randomGrade()}`,
        english: `${this.randomGrade()}`,
        school: `第${i + 1}中学`,
        operation: '',
      })
    }
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
