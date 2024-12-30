<template>
  <div class="grid grid-cols-2 gap-2 rounded-lg bg-base-200/40 py-2 lg:grid-cols-6">
    <div class="flex h-14 flex-col items-center justify-center gap-2 md:h-24">
      <div class="text-sm font-bold md:text-lg">{{ $t('connections') }}</div>
      <div class="text-base md:text-xl">{{ activeConnections.length }}</div>
    </div>
    <div class="flex h-14 flex-col items-center justify-center gap-2 md:h-24">
      <div class="text-sm font-bold md:text-lg">{{ $t('memoryUsage') }}</div>
      <div class="text-base md:text-xl">{{ prettyBytesHelper(memory, { binary: true }) }}</div>
    </div>
    <div class="flex h-14 flex-col items-center justify-center gap-2 md:h-24">
      <div class="text-sm font-bold md:text-lg">{{ $t('download') }}</div>
      <div class="text-base md:text-xl">{{ prettyBytesHelper(downloadTotal) }}</div>
    </div>
    <div class="flex h-14 flex-col items-center justify-center gap-2 md:h-24">
      <div class="text-sm font-bold md:text-lg">{{ $t('dlSpeed') }}</div>
      <div class="text-base md:text-xl">{{ prettyBytesHelper(downloadSpeed) }}/s</div>
    </div>
    <div class="flex h-14 flex-col items-center justify-center gap-2 md:h-24">
      <div class="text-sm font-bold md:text-lg">{{ $t('upload') }}</div>
      <div class="text-base md:text-xl">{{ prettyBytesHelper(uploadTotal) }}</div>
    </div>
    <div class="flex h-14 flex-col items-center justify-center gap-2 md:h-24">
      <div class="text-sm font-bold md:text-lg">{{ $t('ulSpeed') }}</div>
      <div class="text-base md:text-xl">{{ prettyBytesHelper(uploadSpeed) }}/s</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { prettyBytesHelper } from '@/helper'
import { activeConnections, downloadTotal, uploadTotal } from '@/store/connections'
import { downloadSpeed, memory, uploadSpeed } from '@/store/overview'
</script>
