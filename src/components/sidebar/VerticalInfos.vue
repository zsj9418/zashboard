<template>
  <div class="flex flex-col gap-4 text-sm">
    <div class="flex flex-col items-center justify-center">
      <ArrowDownCircleIcon class="h-5 w-5" />
      {{ prettyBytesHelper(downloadTotal) }}
    </div>
    <div class="flex flex-col items-center justify-center">
      <ArrowUpCircleIcon class="h-5 w-5" />
      {{ prettyBytesHelper(uploadTotal) }}
    </div>
    <div class="flex flex-col items-center justify-center">
      <CpuChipIcon class="h-5 w-5" />
      {{ prettyBytesHelper(memory, { binary: true }) }}
    </div>
    <div class="flex flex-col items-center justify-center">
      <button class="btn btn-circle btn-sm">
        <ArrowRightCircleIcon
          class="h-5 w-5"
          @click="isSiderbarCollapsed = false"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { prettyBytesHelper } from '@/helper'
import { isSiderbarCollapsed } from '@/store/config'
import { downloadTotal, uploadTotal } from '@/store/connections'
import { memory } from '@/store/statistic'
import {
  ArrowDownCircleIcon,
  ArrowRightCircleIcon,
  ArrowUpCircleIcon,
  CpuChipIcon,
} from '@heroicons/vue/24/outline'
</script>
