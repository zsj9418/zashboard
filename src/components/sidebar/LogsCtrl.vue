<template>
  <div :class="twMerge('join w-full p-2', horizontal && 'w-96 pb-0')">
    <select
      class="join-item select select-bordered select-sm"
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
    <input
      type="text"
      class="input input-sm join-item input-bordered w-0 flex-1"
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
