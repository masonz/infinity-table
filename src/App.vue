<template>
  <div id="app">
    <infinity-table :data="data"
                    :columns="columns">
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
    for (let i = 1; i < 1; i++) {
      this.data.push({
        id: i,
        name: `name_${i}`,
        class: `class_${i}`,
        teacher: `teacher_${i}`,
        school: `school_${i}`,
        country: `country_${i}`,
      })
    }
  }

  get columns() {
    const colunms: any[] = []
    const firstRow = this.data.find((row) => row.id === 1)
    if (firstRow) {
      Object.keys(firstRow).forEach((key) => {
        colunms.push({ filed: key, title: key })
      })
    }
    return colunms
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
