<template>
  <div :class="`collapse collapse-arrow ${showCollapse ? 'collapse-open' : 'collapse-close'}`">
    <div
      class="collapse-title cursor-pointer pr-4"
      @click="showCollapse = !showCollapse"
    >
      <div class="flex items-center gap-2 pr-6">
        <div class="flex flex-1 items-center gap-1">
          <ProxyIcon
            v-if="proxyGroup.icon"
            :icon="proxyGroup.icon"
          />
          <span class="text-lg font-medium">{{ proxyGroup.name }}</span>
          <span
            class="text-sm"
            v-if="proxyGroup.now"
          >
            -> {{ proxyGroup.now }}
          </span>
        </div>
        <LatencyTag
          :class="twMerge('z-10 bg-base-200/40', isLatencyTesting ? 'animate-pulse' : '')"
          :name="proxyGroup.now"
          @click.stop="handlerLatencyTest"
        />
      </div>
      <div class="flex items-center gap-2 text-xs text-slate-500">
        <div class="flex-1">{{ proxyGroup.type }} ({{ proxyGroup.all?.length }})</div>
        <div class="shrink-0">{{ prettyBytesHelper(downloadTotal) }}/s</div>
      </div>
      <ProxyPreview
        v-if="!showContent"
        :nodes="sortedProxies"
        :now="proxyGroup.now"
      />
    </div>
    <div
      class="collapse-content flex flex-col gap-2 max-sm:px-2"
      @transitionend="handlerTransitionEnd"
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
import { useCollapse } from '@/composables/collapse'
import { prettyBytesHelper, sortAndFilterProxyNodes } from '@/helper'
import { activeConnections } from '@/store/connections'
import { proxyGroupLatencyTest, proxyMap, selectProxy } from '@/store/proxies'
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

const { showCollapse, showContent, handlerTransitionEnd } = useCollapse(props.name)

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
