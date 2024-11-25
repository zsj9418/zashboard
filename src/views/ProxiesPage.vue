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
            v-for="proxyGroup in filterContent(proxyGroups, idx)"
            :key="proxyGroup.name"
            :name="proxyGroup.name"
          />
        </div>
      </div>
    </template>
    <div
      class="grid grid-cols-1 gap-1"
      v-else
    >
      <ProxyGroup
        v-for="proxyGroup in proxyGroups"
        :key="proxyGroup.name"
        :name="proxyGroup.name"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProxyGroup from '@/components/ProxyGroup.vue'
import { isLargeScreen } from '@/helper'
import { twoColumns } from '@/store/config'
import { proxyGroups } from '@/store/proxies'

const filterContent: <T>(all: T[], target: number) => T[] = (all, target) => {
  return all.filter((_, index: number) => index % 2 === target)
}
</script>
