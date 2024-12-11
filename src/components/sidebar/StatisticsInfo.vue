<template>
  <div class="grid grid-cols-2 gap-1">
    <div>{{ $t('connections') }}: {{ activeConnections.length }}</div>
    <div>{{ $t('memoryUsage') }}: {{ prettyBytesHelper(memory, { binary: true }) }}</div>
    <div>{{ $t('download') }}: {{ prettyBytesHelper(downloadTotal) }}</div>
    <div>{{ $t('dlSpeed') }}: {{ prettyBytesHelper(downloadSpeed) }}/s</div>
    <div>{{ $t('upload') }}: {{ prettyBytesHelper(uploadTotal) }}</div>
    <div>{{ $t('ulSpeed') }}: {{ prettyBytesHelper(uploadSpeed) }}/s</div>
  </div>
</template>

<script setup lang="ts">
import { prettyBytesHelper } from '@/helper'
import { activeConnections, downloadTotal, uploadTotal } from '@/store/connections'
import { downloadSpeed, memory, uploadSpeed } from '@/store/statistics'
</script>
