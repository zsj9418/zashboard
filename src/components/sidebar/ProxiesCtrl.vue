<template>
  <div class="p-2 flex flex-col gap-2" v-if="configs">
    <button class="btn btn-sm w-full" @click="flushFakeIPAPI">{{ $t('flushFakeIP') }}</button>
    <select class="select select-sm w-full select-bordered" :value="configs.mode" @change="handlerModeChange">
      <option>Direct</option>
      <option>Rule</option>
      <option>Global</option>
    </select>
    <input type="text" class="input input-bordered input-sm w-full" v-model="speedtestUrl" />
  </div>
</template>

<script setup lang="ts">
import { flushFakeIPAPI } from '@/api';
import { configs, speedtestUrl, updateConfigs } from '@/store/config';

const handlerModeChange = (e: Event) => {
  const mode = (e.target as HTMLSelectElement).value
  updateConfigs({ mode })
}
</script>