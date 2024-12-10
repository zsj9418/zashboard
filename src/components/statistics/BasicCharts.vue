<template>
  <div class="relative h-28 w-full">
    <div
      ref="chart"
      class="h-full w-full"
    ></div>
    <span
      class="hidden bg-base-100 text-base-content"
      ref="text"
    ></span>
    <span
      class="hidden text-primary"
      ref="primaryText"
    ></span>
    <span
      class="hidden text-info"
      ref="secondaryText"
    ></span>
    <button
      class="btn btn-ghost btn-xs absolute bottom-0 right-1"
      @click="isPaused = !isPaused"
    >
      <component
        :is="!isPaused ? PauseCircleIcon : PlayCircleIcon"
        class="h-4 w-4"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { getToolTipForParams, prettyBytesHelper } from '@/helper'
import { theme } from '@/store/settings'
import { PauseCircleIcon, PlayCircleIcon } from '@heroicons/vue/24/outline'
import { useElementSize } from '@vueuse/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { debounce } from 'lodash'
import { computed, onMounted, ref, watch } from 'vue'

echarts.use([LineChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer])

const props = defineProps<{
  toolTip?: boolean
  data: { name: string; data: { name: number; value: number }[] }[]
  suffix?: string
}>()
const text = ref()
const primaryText = ref()
const secondaryText = ref()
const isPaused = ref(false)
const chart = ref()

onMounted(() => {
  const colorMap = {
    color: getComputedStyle(text.value)?.color,
    primaryColor: getComputedStyle(primaryText.value)?.color,
    secondaryColor: getComputedStyle(secondaryText.value)?.color,
    backgroundColor: getComputedStyle(text.value)?.backgroundColor,
  }
  const fontFamily = getComputedStyle(text.value)?.fontFamily

  watch(
    () => theme.value,
    () => {
      colorMap.color = getComputedStyle(text.value)?.color
      colorMap.primaryColor = getComputedStyle(primaryText.value)?.color
      colorMap.secondaryColor = getComputedStyle(secondaryText.value)?.color
      colorMap.backgroundColor = getComputedStyle(text.value)?.backgroundColor
    },
  )

  const options = computed(() => {
    return {
      legend: {
        bottom: 0,
        data: props.data.map((item) => item.name),
        textStyle: {
          color: colorMap.color,
          fontFamily,
        },
      },
      grid: {
        left: 60,
        top: 15,
        right: 10,
        bottom: 25,
      },
      tooltip: {
        show: props.toolTip,
        trigger: 'axis',
        backgroundColor: colorMap.backgroundColor,
        borderColor: colorMap.backgroundColor,
        textStyle: {
          color: colorMap.color,
          fontFamily,
        },
        formatter: (params: ToolTipParams[]) => {
          return params
            .map((item) => {
              return getToolTipForParams(item, props.suffix)
            })
            .join('')
        },
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
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
            color: colorMap.color,
          },
        },
        axisLabel: {
          align: 'left',
          padding: [0, 0, 0, -45],
          formatter: (value: number) => {
            return `${prettyBytesHelper(value, {
              maximumFractionDigits: 1,
            })}/s`
          },
          color: colorMap.color,
          fontFamily,
        },
      },
      series: props.data.map((item, index) => {
        return {
          name: item.name,
          symbol: 'none',
          emphasis: {
            disabled: true,
          },
          data: item.data,
          type: 'line',
          color: index === props.data.length - 1 ? colorMap.primaryColor : colorMap.secondaryColor,
          smooth: true,
        }
      }),
    }
  })
  const myChart = echarts.init(chart.value)

  myChart.setOption(options.value)

  watch(options, () => {
    if (isPaused.value) {
      return
    }
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
