<template>
  <div>
    <div :class="twMerge('join w-full p-2', horizontal && 'max-w-screen-sm')">
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
      <TextInput
        type="text"
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
import TextInput from '../common/TextInput.vue'

defineProps<{
  horizontal?: boolean
}>()
</script>
