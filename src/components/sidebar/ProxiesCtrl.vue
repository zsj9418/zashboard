<template>
  <div
    class="flex flex-col gap-2 p-2"
    v-if="configs"
  >
    <button
      class="btn btn-sm w-full"
      @click="flushFakeIPAPI"
    >
      {{ $t('flushFakeIP') }}
    </button>
    <select
      class="select select-bordered select-sm w-full"
      :value="configs.mode"
      @change="handlerModeChange"
    >
      <option>direct</option>
      <option>rule</option>
      <option>global</option>
    </select>
    <input
      type="text"
      class="input input-sm input-bordered w-full"
      v-model="speedtestUrl"
    />
  </div>
</template>

<script setup lang="ts">
import { flushFakeIPAPI } from '@/api'
import { configs, speedtestUrl, updateConfigs } from '@/store/config'

const handlerModeChange = (e: Event) => {
  const mode = (e.target as HTMLSelectElement).value
  updateConfigs({ mode })
}
</script>
