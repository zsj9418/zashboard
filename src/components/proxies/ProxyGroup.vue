<template>
  <div class="collapse collapse-arrow bg-base-100 shadow-lg">
    <div class="collapse-title">
      <div class="flex items-center gap-2">
        <div class="text-lg font-medium sm:text-xl">
          {{ proxyGroup.name }}
        </div>
        <div class="text-xs sm:text-sm">
          {{ proxyGroup.now }}
        </div>
        <LatencyTag
          :class="twMerge('z-10', isLatencyTesting ? 'animate-pulse' : '')"
          :name="proxyGroup.now"
          @click.stop="handlerLatencyTest"
        />
        <div class="flex-1" />
        <div class="text-sm">{{ prettyBytesHelper(downloadTotal) }}/s</div>
      </div>
      <div
        class="flex flex-wrap gap-1 pt-2"
        v-if="!showCollapse"
      >
        <div
          v-for="node in sortedProxies"
          :key="node"
          class="flex h-4 w-4 items-center justify-center rounded-full shadow-lg"
          :class="getBgColor(getLatencyByName(node))"
        >
          <div
            class="h-2 w-2 rounded-full bg-white"
            v-if="proxyGroup.now === node"
          ></div>
        </div>
      </div>
    </div>
    <input
      type="checkbox"
      v-model="showCollapse"
    />
    <div class="collapse-content flex flex-col gap-2">
      <div
        :class="
          twMerge(
            'grid grid-cols-1 gap-2 sm:grid-cols-2 3xl:grid-cols-3',
            !twoColumns && 'lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5',
          )
        "
        v-if="showContent"
      >
        <ProxyNodeCard
          v-for="node in sortedProxies"
          :key="node"
          :name="node"
          :active="node === proxyGroup.now"
          @click="selectProxy(proxyGroup.name, node)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { prettyBytesHelper, sortProxyNodeByType } from '@/helper'
import { collapseGroupMap, twoColumns } from '@/store/config'
import { activeConnections } from '@/store/connections'
import { getLatencyByName, proxyGroupLatencyTest, proxyMap, selectProxy } from '@/store/proxies'
import { twMerge } from 'tailwind-merge'
import { computed, ref, watch } from 'vue'
import LatencyTag from './LatencyTag.vue'
import ProxyNodeCard from './ProxyNodeCard.vue'
const props = defineProps<{
  name: string
}>()
const getBgColor = (latency: number) => {
  if (latency === 0) {
    return 'bg-gray-500'
  } else if (latency < 300) {
    return 'bg-green-500'
  } else if (latency < 800) {
    return 'bg-yellow-500'
  } else {
    return 'bg-red-500'
  }
}
const showCollapse = computed({
  get() {
    return collapseGroupMap.value[props.name]
  },
  set(value) {
    collapseGroupMap.value[props.name] = value
  },
})
const showContent = ref(showCollapse.value)

watch(showCollapse, (value) => {
  if (value) {
    showContent.value = value
  } else {
    setTimeout(() => {
      if (value === showCollapse.value) {
        showContent.value = value
      }
    }, 1000)
  }
})

const proxyGroup = computed(() => proxyMap.value[props.name])
const sortedProxies = computed(() => {
  return sortProxyNodeByType(proxyGroup.value.all ?? [])
})
const isLatencyTesting = ref(false)
const handlerLatencyTest = async () => {
  if (isLatencyTesting.value) return

  isLatencyTesting.value = true
  await proxyGroupLatencyTest(props.name)
  isLatencyTesting.value = false
}
const downloadTotal = computed(() => {
  const speed = activeConnections.value
    .filter((conn) => conn.chains.includes(props.name))
    .reduce((total, conn) => total + conn.downloadSpeed, 0)

  return speed
})
</script>
