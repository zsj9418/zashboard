<template>
  <div class="h-full overflow-y-auto overflow-x-hidden p-2">
    <template v-if="isLargeScreen && twoColumns">
      <div class="grid grid-cols-2 gap-1">
        <div
          v-for="idx in [0, 1]"
          :key="idx"
          class="flex flex-1 flex-col gap-1"
        >
          <ProxyGroup
            v-for="name in filterContent(renderGroups, idx)"
            :key="name"
            :name="name"
          />
        </div>
      </div>
    </template>
    <div
      class="grid grid-cols-1 gap-1"
      v-else
    >
      <ProxyGroup
        v-for="name in renderGroups"
        :key="name"
        :name="name"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProxyGroup from '@/components/proxies/ProxyGroup.vue'
import { isLargeScreen } from '@/helper'
import { showGlobalProxy, twoColumns } from '@/store/config'
import { GLOBAL, proxyGroups } from '@/store/proxies'
import { computed } from 'vue'

const renderGroups = computed(() => {
  if (showGlobalProxy.value && proxyGroups.value.length) {
    return [...proxyGroups.value, GLOBAL]
  }
  return proxyGroups.value
})

const filterContent: <T>(all: T[], target: number) => T[] = (all, target) => {
  return all.filter((_, index: number) => index % 2 === target)
}
</script>
