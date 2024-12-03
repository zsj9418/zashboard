<template>
  <div class="collapse collapse-arrow bg-base-100 shadow-lg">
    <div class="collapse-title">
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1 text-lg font-medium sm:text-xl">
          <template v-if="proxyGroup.icon">
            <div
              v-if="proxyGroup.icon.startsWith('data:image/svg+xml')"
              class="h-5 w-5 bg-primary"
              :style="{
                maskImage: `url(&quot;${encodeSvg(proxyGroup.icon)}&quot;)`,
                maskSize: '100% 100%',
              }"
            />
            <img
              v-else
              class="w-5"
              :src="proxyGroup.icon"
            />
          </template>
          {{ proxyGroup.name }}

          <span class="text-xs">:: {{ proxyGroup.type }}</span>
        </div>
        <div
          class="flex hidden items-center gap-2 text-xs sm:flex sm:text-sm"
          v-if="proxyGroup.now"
        >
          -> {{ proxyGroup.now }}
        </div>
        <div class="flex-1"></div>
        <div class="text-sm">{{ prettyBytesHelper(downloadTotal) }}/s</div>
        <LatencyTag
          :class="twMerge('z-10', isLatencyTesting ? 'animate-pulse' : '')"
          :name="proxyGroup.now"
          @click.stop="handlerLatencyTest"
        />
      </div>
      <div
        class="flex items-center gap-2 text-xs sm:hidden sm:text-sm"
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
import { activeConnections } from '@/store/connections'
import { proxyGroupLatencyTest, proxyMap, selectProxy } from '@/store/proxies'
import { collapseGroupMap } from '@/store/settings'
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

/**
 * transform an SVG into a data URI
 * @see https://gist.github.com/jennyknuth/222825e315d45a738ed9d6e04c7a88d0
 */
const encodeSvg = (svg: string) => {
  return svg
    .replace('<svg', ~svg.indexOf('xmlns') ? '<svg' : '<svg xmlns="http://www.w3.org/2000/svg"')
    .replace(/"/g, "'")
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/\{/g, '%7B')
    .replace(/\}/g, '%7D')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
}
</script>
