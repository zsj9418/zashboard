<template>
  <div class="flex h-full flex-col gap-1 overflow-y-auto overflow-x-hidden p-2">
    <template v-if="!renderLogs.length">
      <div class="card w-full flex-row gap-1 p-2 text-sm">
        {{ $t('noContent') }}
      </div>
    </template>
    <div
      v-for="log in renderLogs"
      :key="log.seq"
      class="card block p-2 text-sm"
    >
      <span>{{ log.seq }}</span>
      <span class="mx-2 text-primary">{{
        dayjs(log.time).locale(language).format('HH:mm:ss')
      }}</span>
      <span :class="textColorMapForType[log.type]">{{ log.type }}</span>
      <span class="ml-2">{{ log.payload }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LOG_LEVEL } from '@/config'
import { logFilter, logs } from '@/store/logs'
import { language } from '@/store/settings'
import dayjs from 'dayjs'
import { computed } from 'vue'

const textColorMapForType = {
  [LOG_LEVEL.Error]: 'text-error',
  [LOG_LEVEL.Warning]: 'text-warning',
  [LOG_LEVEL.Info]: 'text-info',
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
