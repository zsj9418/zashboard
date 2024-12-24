<template>
  <div
    :class="
      twMerge(
        'grid grid-cols-2 gap-2',
        truncateProxyName && 'max-h-96 overflow-y-auto',
        isSiderbarCollapsed
          ? hasTwoColumns
            ? 'sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5'
            : 'sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 3xl:grid-cols-10'
          : hasTwoColumns
            ? 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4'
            : 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 3xl:grid-cols-8',
      )
    "
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { useProxies } from '@/composables/proxies'
import { isSiderbarCollapsed, truncateProxyName } from '@/store/settings'
import { twMerge } from 'tailwind-merge'

const { hasTwoColumns } = useProxies()
</script>

<style scoped>
.grid {
  scrollbar-width: thin;
}
</style>
