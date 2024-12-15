<template>
  <div class="collapse collapse-arrow">
    <div class="collapse-title">
      <div class="flex items-center gap-2">
        <div class="flex flex-1 items-center gap-1">
          <ProxyIcon
            v-if="proxyGroup.icon"
            :icon="proxyGroup.icon"
          />
          <span class="text-lg font-medium sm:text-xl">{{ proxyGroup.name }}</span>
          <span class="text-xs">({{ proxyGroup.all?.length }})</span>
          <span class="text-xs text-slate-500">: {{ proxyGroup.type }}</span>
          <span
            class="text-sm max-sm:hidden"
            v-if="proxyGroup.now"
          >
            -> {{ proxyGroup.now }}
          </span>
        </div>
        <div class="text-sm">{{ prettyBytesHelper(downloadTotal) }}/s</div>
        <LatencyTag
          :class="twMerge('z-10', isLatencyTesting ? 'animate-pulse' : '')"
          :name="proxyGroup.now"
          @click.stop="handlerLatencyTest"
        />
      </div>
      <div
        class="flex items-center gap-2 text-xs sm:hidden"
        v-if="proxyGroup.now"
      >
        -> {{ proxyGroup.now }}
      </div>
      <ProxyPreview
        v-if="!showCollapse"
        :nodes="sortedProxies"
        :now="proxyGroup.now"
      />
    </div>
    <input
      type="checkbox"
      v-model="showCollapse"
    />
    <div
      class="collapse-content flex flex-col gap-2 max-sm:px-2"
      @transitionend="!showCollapse && (showContent = showCollapse)"
      @transitionstart="showCollapse && (showContent = showCollapse)"
    >
      <ProxyNodeGrid v-if="showContent">
        <ProxyNodeCard
          v-for="node in sortedProxies"
          :key="node"
          :name="node"
          :active="node === proxyGroup.now"
          @click="selectProxy(proxyGroup.name, node)"
        />
      </ProxyNodeGrid>
    </div>
  </div>
</template>

<script setup lang="ts">
import { prettyBytesHelper, sortAndFilterProxyNodes } from '@/helper'
import { activeConnections } from '@/store/connections'
import { proxyGroupLatencyTest, proxyMap, selectProxy } from '@/store/proxies'
import { collapseGroupMap } from '@/store/settings'
import { twMerge } from 'tailwind-merge'
import { computed, ref } from 'vue'
import LatencyTag from './LatencyTag.vue'
import ProxyIcon from './ProxyIcon.vue'
import ProxyNodeCard from './ProxyNodeCard.vue'
import ProxyNodeGrid from './ProxyNodeGrid.vue'
import ProxyPreview from './ProxyPreview.vue'

const props = defineProps<{
  name: string
}>()

const showCollapse = computed({
  get() {
    return collapseGroupMap.value[props.name]
  },
  set(value) {
    collapseGroupMap.value[props.name] = value
  },
})
const showContent = ref(showCollapse.value)
const proxyGroup = computed(() => proxyMap.value[props.name])
const sortedProxies = computed(() => {
  return sortAndFilterProxyNodes(proxyGroup.value.all ?? [])
})
const isLatencyTesting = ref(false)
const handlerLatencyTest = async () => {
  if (isLatencyTesting.value) return

  isLatencyTesting.value = true
  try {
    await proxyGroupLatencyTest(props.name)
    isLatencyTesting.value = false
  } catch {
    isLatencyTesting.value = false
  }
}
const downloadTotal = computed(() => {
  const speed = activeConnections.value
    .filter((conn) => conn.chains.includes(props.name))
    .reduce((total, conn) => total + conn.downloadSpeed, 0)

  return speed
})
</script>
