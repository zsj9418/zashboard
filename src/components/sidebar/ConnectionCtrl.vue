<template>
  <div class="join p-2">
    <input type="text" class="input input-bordered input-sm join-item" v-model="connectionFilter" />
    <button class="btn btn-bordered btn-sm join-item" @click="isPaused = !isPaused">
      <component :is="!isPaused ? PauseIcon : PlayIcon" class="w-4 h-4" />
    </button>
    <button class="btn btn-bordered btn-sm join-item" @click="handlerClickCloseAll">
      <XMarkIcon class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { disconnectByIdAPI } from '@/api';
import { connectionFilter, isPaused, renderConnections } from '@/store/connections';
import { PauseIcon, PlayIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const handlerClickCloseAll = () => {
  renderConnections.value.forEach(conn => {
    disconnectByIdAPI(conn.id)
  })
}

</script>