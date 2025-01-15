<template>
  <div class="grid grid-cols-2 gap-2 rounded-lg bg-base-200/40 px-4 py-2 lg:grid-cols-6">
    <div class="flex h-14 flex-col items-start justify-center gap-2 lg:h-24 lg:items-center">
      <div class="text-sm lg:text-lg lg:font-bold">{{ $t('connections') }}</div>
      <div class="text-xl">{{ activeConnections.length }}</div>
    </div>
    <div class="flex h-14 flex-col items-start justify-center gap-2 lg:h-24 lg:items-center">
      <div class="text-sm lg:text-lg lg:font-bold">{{ $t('memoryUsage') }}</div>
      <div class="text-xl">{{ prettyBytesHelper(memory, { binary: true }) }}</div>
    </div>
    <div class="flex h-14 flex-col items-start justify-center gap-2 lg:h-24 lg:items-center">
      <div class="text-sm lg:text-lg lg:font-bold">{{ $t('download') }}</div>
      <div class="text-xl">{{ prettyBytesHelper(downloadTotal) }}</div>
    </div>
    <div class="flex h-14 flex-col items-start justify-center gap-2 lg:h-24 lg:items-center">
      <div class="text-sm lg:text-lg lg:font-bold">{{ $t('dlSpeed') }}</div>
      <div class="text-xl">{{ prettyBytesHelper(downloadSpeed) }}/s</div>
    </div>
    <div class="flex h-14 flex-col items-start justify-center gap-2 lg:h-24 lg:items-center">
      <div class="text-sm lg:text-lg lg:font-bold">{{ $t('upload') }}</div>
      <div class="text-xl">{{ prettyBytesHelper(uploadTotal) }}</div>
    </div>
    <div class="flex h-14 flex-col items-start justify-center gap-2 lg:h-24 lg:items-center">
      <div class="text-sm lg:text-lg lg:font-bold">{{ $t('ulSpeed') }}</div>
      <div class="text-xl">{{ prettyBytesHelper(uploadSpeed) }}/s</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { prettyBytesHelper } from '@/helper'
import { activeConnections, downloadTotal, uploadTotal } from '@/store/connections'
import { downloadSpeed, memory, uploadSpeed } from '@/store/overview'
</script>
