<template>
  <div class="p-2 flex flex-col gap-2 h-full overflow-x-hidden overflow-y-auto">
    <template v-if="!renderLogs.length">  
      <div class="card bg-base-100 w-full p-2 shadow-xl gap-1 text-sm flex-row">
        {{ $t('noContent') }}
      </div>
    </template>
    <div 
      v-for="log in renderLogs" 
      :key="log.seq" 
      class="card bg-base-100 w-full p-2 shadow-xl gap-1 text-sm flex-row"
    >
      <span>{{ log.seq }}</span>
      <span class="text-primary">{{ log.type }}</span>
      <span>{{ log.payload }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { logFilter, logs } from '@/store/logs';
import { computed } from 'vue';

const renderLogs = computed(() => {
  return logs.value.filter((log) => {
    if (logFilter.value) {
      return log.payload.includes(logFilter.value) || log.type.includes(logFilter.value)
    }

    return true
  })
})
</script>
