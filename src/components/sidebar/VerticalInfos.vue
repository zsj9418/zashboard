<template>
  <div class="flex flex-col gap-4 text-xs">
    <div class="flex flex-col items-center justify-center">
      <ArrowsRightLeftIcon class="h-4 w-4" />
      {{ activeConnections.length }}
    </div>
    <div class="flex flex-col items-center justify-center">
      <ArrowDownCircleIcon class="h-4 w-4" />
      {{ prettyBytesHelper(downloadTotal) }}
      <span> {{ prettyBytesHelper(downloadSpeedTotal) }}/s </span>
    </div>
    <div class="flex flex-col items-center justify-center">
      <ArrowUpCircleIcon class="h-4 w-4" />
      {{ prettyBytesHelper(uploadTotal) }}
      <span> {{ prettyBytesHelper(uploadSpeedTotal) }}/s </span>
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
import { isSiderbarCollapsed } from '@/store/config'
import {
  activeConnections,
  downloadSpeedTotal,
  downloadTotal,
  uploadSpeedTotal,
  uploadTotal,
} from '@/store/connections'
import { memory } from '@/store/statistic'
import {
  ArrowDownCircleIcon,
  ArrowRightCircleIcon,
  ArrowsRightLeftIcon,
  ArrowUpCircleIcon,
  CpuChipIcon,
} from '@heroicons/vue/24/outline'
</script>
