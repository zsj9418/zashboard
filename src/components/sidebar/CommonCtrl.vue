<template>
  <div class="flex justify-between">
    <div class="flex flex-col gap-2 p-2 text-xs">
      <div>{{ $t('connections') }}: {{ activeConnections.length }}</div>
      <div>
        {{ $t('download') }}: {{ prettyBytesHelper(downloadTotal) }} ({{
          prettyBytesHelper(downloadSpeed)
        }}/s)
      </div>
      <div>
        {{ $t('upload') }}: {{ prettyBytesHelper(uploadTotal) }} ({{
          prettyBytesHelper(uploadSpeed)
        }}/s)
      </div>
      <div>{{ $t('memoryUsage') }}: {{ prettyBytesHelper(memory, { binary: true }) }}</div>
      <div>
        {{ $t('version') }}:
        {{ version }}
      </div>
      <BackendSwitch />
    </div>
    <div class="flex flex-1 items-end justify-end p-2">
      <button
        class="btn btn-circle btn-ghost btn-xs"
        @click="isSiderbarCollapsed = true"
      >
        <ArrowLeftCircleIcon class="h-5 w-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { version } from '@/api'
import { prettyBytesHelper } from '@/helper'
import { isSiderbarCollapsed } from '@/store/config'
import { activeConnections, downloadTotal, uploadTotal } from '@/store/connections'
import { downloadSpeed, memory, uploadSpeed } from '@/store/statistics'
import { ArrowLeftCircleIcon } from '@heroicons/vue/24/outline'
import BackendSwitch from '../settings/BackendSwitch.vue'
</script>
