<template>
  <div class="collapse collapse-arrow bg-base-100 shadow-lg">
    <div class="collapse-title">
      <div class="items-top flex gap-2">
        <div class="flex flex-col gap-2 sm:flex-row">
          <div class="flex items-center gap-1 text-lg font-medium sm:text-xl">
            <img
              v-if="proxyGroup.icon"
              class="w-5"
              :src="proxyGroup.icon"
            />
            {{ proxyGroup.name }}
          </div>
          <div class="flex items-center gap-2 text-xs sm:text-sm">-> {{ proxyGroup.now }}</div>
        </div>
        <div class="flex-1" />
        <div class="mt-1 flex gap-2">
          <div class="text-sm">{{ prettyBytesHelper(downloadTotal) }}/s</div>
          <LatencyTag
            :class="twMerge('z-10', isLatencyTesting ? 'animate-pulse' : '')"
            :name="proxyGroup.now"
            @click.stop="handlerLatencyTest"
          />
        </div>
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
    <div class="collapse-content flex flex-col gap-2">
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
import { prettyBytesHelper, sortProxyNodeByType } from '@/helper'
import { collapseGroupMap } from '@/store/config'
import { activeConnections } from '@/store/connections'
import { proxyGroupLatencyTest, proxyMap, selectProxy } from '@/store/proxies'
import { twMerge } from 'tailwind-merge'
import { computed, ref, watch } from 'vue'
import LatencyTag from './LatencyTag.vue'
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
