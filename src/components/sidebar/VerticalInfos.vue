<template>
  <div class="card mx-1 flex flex-col gap-4 py-2 text-xs">
    <div class="flex flex-col items-center justify-center">
      <ArrowsRightLeftIcon class="h-4 w-4" />
      {{ activeConnections.length }}
    </div>
    <div class="flex flex-col items-center justify-center">
      <ArrowDownCircleIcon class="h-4 w-4" />
      {{ prettyBytesHelper(downloadTotal) }}
      <span> {{ prettyBytesHelper(downloadSpeed) }}/s </span>
    </div>
    <div class="flex flex-col items-center justify-center">
      <ArrowUpCircleIcon class="h-4 w-4" />
      {{ prettyBytesHelper(uploadTotal) }}
      <span> {{ prettyBytesHelper(uploadSpeed) }}/s </span>
    </div>
    <div class="flex flex-col items-center justify-center">
      <CpuChipIcon class="h-4 w-4" />
      {{ prettyBytesHelper(memory, { binary: true }) }}
    </div>
    <div class="flex flex-col items-center justify-center">
      <button
        class="btn btn-circle btn-sm"
        @click="isSiderbarCollapsed = false"
      >
        <ArrowRightCircleIcon class="h-5 w-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { prettyBytesHelper } from '@/helper'
import { activeConnections, downloadTotal, uploadTotal } from '@/store/connections'
import { isSiderbarCollapsed } from '@/store/settings'
import { downloadSpeed, memory, uploadSpeed } from '@/store/statistics'
import {
  ArrowDownCircleIcon,
  ArrowRightCircleIcon,
  ArrowsRightLeftIcon,
  ArrowUpCircleIcon,
  CpuChipIcon,
} from '@heroicons/vue/24/outline'
</script>
