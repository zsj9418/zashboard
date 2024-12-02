<template>
  <div
    :class="
      twMerge(
        'grid gap-2',
        twoColumnsForProxyGroupInMobile ? 'grid-cols-2' : 'grid-cols-1',
        isSiderbarCollapsed
          ? inTwoColumns
            ? 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-3'
            : 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6'
          : inTwoColumns
            ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 3xl:grid-cols-3'
            : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5',
      )
    "
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { PROXY_TAB_TYPE } from '@/config'
import {
  isSiderbarCollapsed,
  proxiesTabShow,
  twoColumns,
  twoColumnsForProxyGroupInMobile,
} from '@/store/config'
import { proxyGroupList, proxyProviederList } from '@/store/proxies'
import { twMerge } from 'tailwind-merge'
import { computed } from 'vue'

const inTwoColumns = computed(() => {
  if (proxiesTabShow.value === PROXY_TAB_TYPE.PROXIES) {
    return twoColumns.value && proxyGroupList.value.length > 1
  } else {
    return twoColumns.value && proxyProviederList.value.length > 1
  }
})
</script>
