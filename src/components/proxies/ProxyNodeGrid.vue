<template>
  <div
    :class="
      twMerge(
        'grid gap-2',
        twoColumnNodeForMobile ? 'grid-cols-2' : 'grid-cols-1',
        isSiderbarCollapsed
          ? hasTwoColumns
            ? 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-3'
            : 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6'
          : hasTwoColumns
            ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 3xl:grid-cols-3'
            : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5',
      )
    "
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { useProxies } from '@/composables/proxies'
import { isSiderbarCollapsed, twoColumnNodeForMobile } from '@/store/settings'
import { twMerge } from 'tailwind-merge'

const { hasTwoColumns } = useProxies()
</script>
