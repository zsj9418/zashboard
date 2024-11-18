<template>
  <div class="collapse collapse-arrow bg-base-100 shadow-xl">
    <div class="collapse-title">
      <div class="flex items-center gap-2">
        <div class="text-xl font-medium">
          {{ proxyGroup.name }}
        </div>
        <div class="text-sm">
          {{ proxyGroup.now }}
        </div>
        <LatencyTag :class="twMerge('z-10', isLatencyTesting ? 'animate-pulse' : '')" :name="proxyGroup.now"
          @click.stop="handlerLatencyTest" />
        <div class="flex-1" />
        <div class="text-sm">
          {{ prettyBytes(downloadTotal) }}/s
        </div>
      </div>
      <div class="flex flex-wrap gap-1 pt-2" v-if="!showCollapse">
        <div v-for="node in proxyGroup.all" :key="node" class="shadow-sm w-4 h-4 rounded-full flex items-center justify-center"
          :class="getBgColor(getLatencyByName(node))">
          <div class="w-2 h-2 rounded-full bg-white" v-if="proxyGroup.now === node"></div>
        </div>
      </div>
    </div>
    <input type="checkbox" v-model="showCollapse" />
    <div class="collapse-content flex flex-col gap-2">
      <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
        <ProxyNodeCard v-for="node in proxyGroup.all" :key="node" :name="node" :active="node === proxyGroup.now"
          @click="selectProxy(proxyGroup.name, node)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LatencyTag from '@/components/LatencyTag.vue';
import ProxyNodeCard from '@/components/ProxyNodeCard.vue';
import { collapseGroupMap } from '@/store/config';
import { activeConnections } from '@/store/connections';
import { selectProxy, proxyMap, proxyGroupLatencyTest, getLatencyByName } from '@/store/proxies';
import prettyBytes from 'pretty-bytes';
import { twMerge } from 'tailwind-merge';
import { computed, ref } from 'vue';
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
  }
})
const proxyGroup = computed(() => proxyMap.value[props.name])
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