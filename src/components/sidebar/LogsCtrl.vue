<template>
  <div class="join p-2">
    <input type="text" class="input input-bordered input-sm join-item" v-model="logFilter" />
    <button class="btn btn-bordered btn-sm join-item" @click="isPaused = !isPaused">
      <component :is="!isPaused ? PauseIcon : PlayIcon" class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { logFilter, isPaused } from '@/store/logs';
import { PauseIcon, PlayIcon } from '@heroicons/vue/24/outline';


</script>