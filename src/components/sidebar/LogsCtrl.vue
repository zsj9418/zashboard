<template>
  <div class="flex flex-col gap-2 p-2 text-sm">
    <div class="flex items-center gap-2">
      {{ $t('logLevel') }}:
      <select
        class="select select-bordered select-sm"
        v-model="logLevel"
        @change="initLogs"
      >
        <option
          v-for="opt in Object.values(LOG_LEVEL)"
          :key="opt"
          :value="opt"
        >
          {{ opt }}
        </option>
      </select>
    </div>
    <div class="join">
      <input
        type="text"
        class="input input-sm join-item input-bordered"
        v-model="logFilter"
      />
      <button
        class="btn-bordered btn join-item btn-sm"
        @click="isPaused = !isPaused"
      >
        <component
          :is="!isPaused ? PauseIcon : PlayIcon"
          class="h-4 w-4"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { initLogs, isPaused, LOG_LEVEL, logFilter, logLevel } from '@/store/logs'
import { PauseIcon, PlayIcon } from '@heroicons/vue/24/outline'
</script>
