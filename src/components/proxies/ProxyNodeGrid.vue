<template>
  <div
    :class="
      twMerge(
        'grid grid-cols-1 gap-2',
        isSiderbarCollapsed
          ? inTwoColumns
            ? 'sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3'
            : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
          : inTwoColumns
            ? 'sm:grid-cols-2 3xl:grid-cols-3'
            : 'sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4',
      )
    "
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { PROXY_TAB_TYPE } from '@/config'
import { isSiderbarCollapsed, proxiesTabShow, twoColumns } from '@/store/config'
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
