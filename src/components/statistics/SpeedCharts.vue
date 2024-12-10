<template>
  <BasicCharts
    :data="speedChartsData"
    :tool-tip="true"
    :suffix="'/s'"
  />
</template>

<script setup lang="ts">
import { downloadSpeedHistory, uploadSpeedHistory } from '@/store/statistics'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BasicCharts from './BasicCharts.vue'

const { t } = useI18n()
const speedChartsData = computed(() => {
  return [
    {
      name: t('ulSpeed'),
      data: uploadSpeedHistory.value,
    },
    {
      name: t('dlSpeed'),
      data: downloadSpeedHistory.value,
    },
  ]
})
</script>
