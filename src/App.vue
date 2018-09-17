<template>
  <div id="app">
    <infinity-table style="margin: 0 100px;"
                    :data="data"
                    :column-defs="columnDefs"
                    :height="750"
                    hover>
      <template slot-scope="s"
                slot="id">
        <span @click="onClick(s.row)"
              style="color: #409eff;">
          {{ s.row.id }}
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
  protected data: any[] = []

  public mounted() {
    this.data = []
    for (let i = 0; i < 500; i++) {
      this.data.push({
        id: i,
        name: `name_${i}`,
        class: `class_${i}`,
        teacher: `teacher_${i}teacher_${i}teacher_${i}`,
        school: `school_${i}`,
        country: `country_${i}`,
      })
    }
  }

  get columnDefs() {
    const colunms: any[] = []
    const firstRow = this.data.find((row) => row.id === 1)
    if (firstRow) {
      Object.keys(firstRow).forEach((key, i) => {
        const column = {
          filed: key,
          title: key,
          width: 100 + i * 20,
          fixed: '',
          slot: i === 0,
        }
        if (i <= 0) {
          column.fixed = 'left'
        }
        if (i >= 5) {
          column.fixed = 'right'
        }
        colunms.push(column)
      })
    }
    return colunms
  }

  public onClick(row: any) {
    alert(`自定义单元格: ${row.id}`)
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
</style>
