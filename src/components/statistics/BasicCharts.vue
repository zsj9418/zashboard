<template>
  <div class="relative h-28 w-full overflow-hidden">
    <div
      ref="chart"
      class="h-full w-full"
    ></div>
    <span
      class="hidden border-base-content/10 bg-base-100/70 text-base-content"
      ref="baseColorRef"
    ></span>
    <span
      class="hidden bg-info text-primary"
      ref="themeColorRef"
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
import { font, theme } from '@/store/settings'
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
  data: { name: string; color?: number; data: { name: number; value: number }[] }[]
  labelFormatter: (value: number) => string
  toolTipFormatter: (value: ToolTipParams[]) => string
  min: number
}>()

const baseColorRef = ref()
const themeColorRef = ref()

const isPaused = ref(false)
const chart = ref()

onMounted(() => {
  const baseColorStyle = getComputedStyle(baseColorRef.value)
  const themeColorStyle = getComputedStyle(themeColorRef.value)

  let color = baseColorStyle.color
  let backgroundColor = baseColorStyle.backgroundColor
  let lineColor = baseColorStyle.borderColor
  let fontFamily = baseColorStyle.fontFamily
  let primaryColor = themeColorStyle.color
  let secondaryColor = themeColorStyle.backgroundColor
  watch(
    () => theme.value,
    () => {
      const baseColorStyle = getComputedStyle(baseColorRef.value)
      const themeColorStyle = getComputedStyle(themeColorRef.value)

      color = baseColorStyle.color
      backgroundColor = baseColorStyle.backgroundColor
      lineColor = baseColorStyle.borderColor
      primaryColor = themeColorStyle.color
      secondaryColor = themeColorStyle.backgroundColor
    },
  )
  watch(
    () => font.value,
    () => {
      const baseColorStyle = getComputedStyle(baseColorRef.value)

      fontFamily = baseColorStyle.fontFamily
    },
  )

  const options = computed(() => {
    return {
      legend: {
        bottom: 0,
        data: props.data.map((item) => item.name),
        textStyle: {
          color: color,
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
        show: true,
        trigger: 'axis',
        backgroundColor: backgroundColor,
        borderColor: backgroundColor,
        confine: true,
        textStyle: {
          color: color,
          fontFamily,
        },
        formatter: props.toolTipFormatter,
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
          return Math.max(value.max, props.min)
        },
        axisLine: { show: false },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
            color: lineColor,
          },
        },
        axisLabel: {
          align: 'left',
          padding: [0, 0, 0, -45],
          formatter: props.labelFormatter,
          color: color,
          fontFamily,
        },
      },
      series: props.data.map((item, index) => {
        const colorIndex = item?.color ?? index

        return {
          name: item.name,
          symbol: 'none',
          emphasis: {
            disabled: true,
          },
          data: item.data,
          type: 'line',
          color: colorIndex === 1 ? primaryColor : secondaryColor,
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
