<template>
  <div
    ref="chart"
    class="h-28 w-full"
  ></div>
  <span
    class="hidden text-base-content"
    ref="text"
  ></span>
</template>

<script setup lang="ts">
import { prettyBytesHelper } from '@/helper'
import { theme } from '@/store/settings'
import { memoryHistory } from '@/store/statistics'
import { useElementSize } from '@vueuse/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, LegendComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { debounce } from 'lodash'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

echarts.use([LineChart, GridComponent, LegendComponent, CanvasRenderer])

const text = ref()
const t = useI18n().t
const chart = ref()

onMounted(() => {
  let color = getComputedStyle(text.value)?.color
  watch(
    () => theme.value,
    () => {
      color = getComputedStyle(text.value)?.color
    },
  )
  const options = computed(() => {
    return {
      legend: {
        bottom: 0,
        data: [t('memoryUsage')],
        textStyle: {
          color: color,
        },
      },
      grid: {
        left: 60,
        top: 15,
        right: 10,
        bottom: 25,
      },
      xAxis: {
        type: 'category',
        axisLine: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        splitNumber: 4,
        max: (value: { max: number }) => {
          return Math.max(value.max, 100 * 1024)
        },
        axisLine: { show: false },
        axisLabel: {
          align: 'left',
          padding: [0, 0, 0, -45],
          formatter: (value: number) => {
            return `${prettyBytesHelper(value, {
              maximumFractionDigits: 1,
              binary: true,
            })}`
          },
          color: color,
        },
        splitLine: { show: false },
      },
      series: [
        {
          name: t('memoryUsage'),
          data: memoryHistory.value,
          symbol: 'none',
          emphasis: {
            disabled: true,
          },
          type: 'line',
          color: color,
          smooth: true,
        },
      ],
    }
  })
  const myChart = echarts.init(chart.value)

  myChart.setOption(options.value)

  watch(options, () => {
    myChart?.setOption(options.value)
  })

  const { width } = useElementSize(chart)
  const resize = debounce(() => {
    myChart.resize()
  }, 100)

  watch(
    () => width.value,
    () => {
      resize()
    },
  )
})
</script>
