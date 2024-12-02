<template>
  <div
    class="flex flex-wrap gap-1 pt-2"
    v-if="showDots"
  >
    <div
      v-for="node in nodesLatency"
      :key="node.name"
      class="flex h-4 w-4 items-center justify-center rounded-full shadow-lg"
      :class="getBgColor(node.latency)"
    >
      <div
        class="h-2 w-2 rounded-full bg-white"
        v-if="now === node.name"
      ></div>
    </div>
  </div>
  <div
    class="flex items-center gap-2 py-2"
    v-else
  >
    <div class="flex flex-1 items-center justify-center overflow-hidden rounded-2xl [&>*]:h-2">
      <div
        :class="getBgColor(LATENCY_STATUS.MEDIUM - 1)"
        :style="{
          width: `${(goodsCounts * 100) / nodes.length}%`, // cant use tw class, otherwise dynamic classname won't be generated
        }"
      />
      <div
        :class="getBgColor(LATENCY_STATUS.HIGH - 1)"
        :style="{
          width: `${(mediumCounts * 100) / nodes.length}%`,
        }"
      />
      <div
        :class="getBgColor(LATENCY_STATUS.HIGH + 1)"
        :style="{
          width: `${(badCounts * 100) / nodes.length}%`,
        }"
      />
      <div
        :class="getBgColor(LATENCY_STATUS.NOT_CONNECTED)"
        :style="{
          width: `${(notConnectedCounts * 100) / nodes.length}%`,
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { LATENCY_STATUS, PROXY_PREVIEW_TYPE } from '@/config'
import { getLatencyByName } from '@/store/proxies'
import { proxyPreviewType } from '@/store/settings'
import { computed } from 'vue'

const props = defineProps<{
  nodes: string[]
  now?: string
}>()

const showDots = computed(() => {
  return (
    proxyPreviewType.value === PROXY_PREVIEW_TYPE.DOTS ||
    (proxyPreviewType.value === PROXY_PREVIEW_TYPE.AUTO && props.nodes.length < 20)
  )
})

const nodesLatency = computed(() =>
  props.nodes.map((name) => {
    return {
      latency: getLatencyByName(name),
      name: name,
    }
  }),
)
const getBgColor = (latency: number) => {
  if (latency === LATENCY_STATUS.NOT_CONNECTED) {
    return 'bg-gray-500'
  } else if (latency < LATENCY_STATUS.MEDIUM) {
    return 'bg-green-500'
  } else if (latency < LATENCY_STATUS.HIGH) {
    return 'bg-yellow-500'
  } else {
    return 'bg-red-500'
  }
}

const goodsCounts = computed(() => {
  return nodesLatency.value.filter(
    (node) => node.latency < LATENCY_STATUS.MEDIUM && node.latency > LATENCY_STATUS.NOT_CONNECTED,
  ).length
})
const mediumCounts = computed(() => {
  return nodesLatency.value.filter(
    (node) => node.latency >= LATENCY_STATUS.MEDIUM && node.latency < LATENCY_STATUS.HIGH,
  ).length
})
const badCounts = computed(() => {
  return nodesLatency.value.filter((node) => node.latency >= LATENCY_STATUS.HIGH).length
})
const notConnectedCounts = computed(() => {
  return nodesLatency.value.filter((node) => node.latency === LATENCY_STATUS.NOT_CONNECTED).length
})
</script>
