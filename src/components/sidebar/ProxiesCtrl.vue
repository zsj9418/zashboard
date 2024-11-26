<template>
  <div
    class="flex flex-col gap-2 p-2"
    v-if="configs"
  >
    <div
      role="tablist"
      class="tabs-boxed tabs tabs-sm"
      v-if="proxyProviederList.length"
    >
      <a
        role="tab"
        class="tab"
        v-for="type in PROXY_TAB_TYPE"
        :key="type"
        :class="{ 'tab-active': proxiesTabShow === type }"
        @click="proxiesTabShow = type"
      >
        {{ $t(type) }}</a
      >
    </div>
    <select
      class="select select-bordered select-sm w-full"
      :value="configs.mode"
      @change="handlerModeChange"
    >
      <option
        v-for="mode in modeList"
        :key="mode"
        :label="mode"
        :value="mode"
      />
    </select>
    <button
      class="btn btn-sm w-full"
      @click="flushFakeIPAPI"
    >
      {{ $t('flushFakeIP') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { flushFakeIPAPI } from '@/api'
import { configs, proxiesTabShow, PROXY_TAB_TYPE, updateConfigs } from '@/store/config'
import { proxyProviederList } from '@/store/proxies'
import { computed } from 'vue'

const modeList = computed(() => {
  return configs.value?.['mode-list'] || ['direct', 'rule', 'global']
})

const handlerModeChange = (e: Event) => {
  const mode = (e.target as HTMLSelectElement).value
  updateConfigs({ mode })
}
</script>
