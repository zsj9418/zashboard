<template>
  <div class="p-2 flex flex-col gap-2 text-sm">
    <div class="flex items-center gap-2" v-if="isLargeScreen">
      {{ $t('compactCard') }}:
      <input type="checkbox" class="toggle" v-model="compactConnectionCard" />
    </div>
    <div class="flex items-center gap-2">
      {{ $t('sortBy') }}: 
      <select class="select select-bordered select-sm" v-model="connectionSortType">
        <option v-for="opt in Object.values(sortType)" :key="opt" :value="opt">{{ $t(opt) || opt }}</option>
      </select>
    </div>
    <div class="flex items-center gap-2">
      {{ $t('quickFilter') }}: 
      <input type="text" class="input input-bordered input-sm w-32 join-item" v-model="quickFilterRegex" />
      <input type="checkbox" class="toggle" v-model="quickFilterEnabled" />
    </div>
    <div class="join">
      <input type="text" class="input input-bordered input-sm join-item" v-model="connectionFilter" />
      <button class="btn btn-bordered btn-sm join-item" @click="isPaused = !isPaused">
        <component :is="!isPaused ? PauseIcon : PlayIcon" class="w-4 h-4" />
      </button>
      <button class="btn btn-bordered btn-sm join-item" @click="handlerClickCloseAll">
        <XMarkIcon class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { disconnectByIdAPI } from '@/api';
import { isLargeScreen } from '@/helper';
import { compactConnectionCard } from '@/store/config';
import { connectionFilter, connectionSortType, isPaused, quickFilterEnabled, quickFilterRegex, renderConnections, sortType } from '@/store/connections';
import { PauseIcon, PlayIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const handlerClickCloseAll = () => {
  renderConnections.value.forEach(conn => {
    disconnectByIdAPI(conn.id)
  })
}

</script>