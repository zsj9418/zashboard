<template>
  <div class="flex h-full flex-col gap-1 overflow-y-auto overflow-x-hidden p-2">
    <template v-if="!renderLogs.length">
      <div class="card w-full flex-row gap-1 rounded-xl bg-base-100 p-2 text-sm shadow-lg">
        {{ $t('noContent') }}
      </div>
    </template>
    <div
      v-for="log in renderLogs"
      :key="log.seq"
      class="card w-full flex-row gap-1 rounded-xl bg-base-100 p-2 text-sm shadow-lg"
    >
      <span>{{ log.seq }}</span>
      <span :class="textColorMapForType[log.type]">{{ log.type }}</span>
      <span>{{ log.payload }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LOG_LEVEL, logFilter, logs } from '@/store/logs'
import { computed } from 'vue'

const textColorMapForType = {
  [LOG_LEVEL.Error]: 'text-error',
  [LOG_LEVEL.Warning]: 'text-warning',
  [LOG_LEVEL.Info]: 'text-primary',
  [LOG_LEVEL.Debug]: 'text-accent',
}

const renderLogs = computed(() => {
  return logs.value.filter((log) => {
    if (logFilter.value) {
      return log.payload.includes(logFilter.value) || log.type.includes(logFilter.value)
    }

    return true
  })
})
</script>
