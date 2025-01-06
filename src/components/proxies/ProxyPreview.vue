<template>
  <div
    class="flex flex-wrap gap-1 pt-2"
    v-if="showDots"
  >
    <div
      v-for="node in nodesLatency"
      :key="node.name"
      class="flex h-4 w-4 items-center justify-center rounded-full hover:scale-110"
      :class="getBgColor(node.latency)"
      @click.stop="$emit('nodeclick', node.name)"
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
        :class="getBgColor(lowLatency - 1)"
        :style="{
          width: `${(goodsCounts * 100) / nodes.length}%`, // cant use tw class, otherwise dynamic classname won't be generated
        }"
      />
      <div
        :class="getBgColor(mediumLatency - 1)"
        :style="{
          width: `${(mediumCounts * 100) / nodes.length}%`,
        }"
      />
      <div
        :class="getBgColor(mediumLatency + 1)"
        :style="{
          width: `${(badCounts * 100) / nodes.length}%`,
        }"
      />
      <div
        :class="getBgColor(NOT_CONNECTED)"
        :style="{
          width: `${(notConnectedCounts * 100) / nodes.length}%`,
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NOT_CONNECTED, PROXY_PREVIEW_TYPE } from '@/config'
import { getLatencyByName } from '@/store/proxies'
import { lowLatency, mediumLatency, proxyPreviewType } from '@/store/settings'
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
  if (latency === NOT_CONNECTED) {
    return 'bg-gray-500'
  } else if (latency < lowLatency.value) {
    return 'bg-low-latency'
  } else if (latency < mediumLatency.value) {
    return 'bg-medium-latency'
  } else {
    return 'bg-high-latency'
  }
}

const goodsCounts = computed(() => {
  return nodesLatency.value.filter(
    (node) => node.latency < lowLatency.value && node.latency > NOT_CONNECTED,
  ).length
})
const mediumCounts = computed(() => {
  return nodesLatency.value.filter(
    (node) => node.latency >= lowLatency.value && node.latency < mediumLatency.value,
  ).length
})
const badCounts = computed(() => {
  return nodesLatency.value.filter((node) => node.latency >= mediumLatency.value).length
})
const notConnectedCounts = computed(() => {
  return nodesLatency.value.filter((node) => node.latency === NOT_CONNECTED).length
})
</script>
