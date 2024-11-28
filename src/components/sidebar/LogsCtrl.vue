<template>
  <div :class="twMerge('flex flex-col gap-2 p-2', horizontal && 'flex-row px-0')">
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
import { LOG_LEVEL } from '@/config'
import { initLogs, isPaused, logFilter, logLevel } from '@/store/logs'
import { PauseIcon, PlayIcon } from '@heroicons/vue/24/outline'
import { twMerge } from 'tailwind-merge'

defineProps<{
  horizontal?: boolean
}>()
</script>
