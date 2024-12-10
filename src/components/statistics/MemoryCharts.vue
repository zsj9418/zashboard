<template>
  <BasicCharts
    :data="memoryChartsData"
    :tool-tip="true"
  />
</template>

<script setup lang="ts">
import { memoryHistory } from '@/store/statistics'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BasicCharts from './BasicCharts.vue'

const { t } = useI18n()
const memoryChartsData = computed(() => {
  return [
    {
      name: t('memoryUsage'),
      data: memoryHistory.value,
    },
  ]
})
</script>
