<script lang="ts" setup>
import { ref } from 'vue'
import { useContext } from 'vue-presetup'
import { ElTable, ElTableColumn, ElLoading } from 'element-plus'
import Counter from '../components/Counter.vue'

interface Record {
  date: string
  name: string
  address: string
}

const getTableData = async (): Promise<Record[]> => {
  // Simulate some blocking behavior
  await new Promise(resolve => window.setTimeout(resolve, 1200))

  return [
    {
      date: '2016-05-03',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-02',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-04',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-01',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
  ]
}

defineOptions({
  name: 'bar'
})

const vLoading = ElLoading.directive
const loading = ref(true)
const records = ref<Record[]>([])
const context = useContext()

getTableData().then(data => {
  records.value = data
  loading.value = false

  // Is ready
  context.resolve()
})
</script>

<template>
  <div class="Bar">
    <h1>Bar.vue</h1>
    <Counter />
    <br />
    <br />
    <p>{{ $t('BAR_MESSAGE') }}</p>
    <ElTable v-loading="loading" :data="records" style="width: 800px; margin-top: 20px;">
      <ElTableColumn prop="date" label="Date" width="180" />
      <ElTableColumn prop="name" label="Name" width="180" />
      <ElTableColumn prop="address" label="Address" />
    </ElTable>
  </div>
</template>
