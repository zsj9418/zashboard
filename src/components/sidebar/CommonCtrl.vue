<template>
  <div class="flex flex-col gap-2">
    <div class="flex">
      <div class="text-xs flex flex-col gap-2 p-2">
        <div>{{ $t('connections') }}: {{ activeConnections.length }}</div>
        <div>{{ $t('download') }}: {{ prettyBytes(downloadTotal) }} ({{ prettyBytes(downloadSpeedTotal) }}/s)</div>
        <div>{{ $t('upload') }}: {{ prettyBytes(uploadTotal) }} ({{ prettyBytes(uploadSpeedTotal) }}/s)</div>
        <div>{{ $t('memoryUsage') }}: {{ prettyBytes(memory) }}</div>
        <div>{{ $t('version') }}: {{ version }}</div>
        <div class="flex gap-2">
          <select class="select select-xs w-48 select-bordered" v-model="activeUuid">
            <option v-for="opt in opts" :key="opt.value" :value="opt.value" >{{ opt.label }}</option>
          </select>
          <button class="btn btn-xs btn-circle" @click="addBackend">
            <PlusIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
      <div class="flex justify-end items-end flex-1 p-2">
        <LanguageIcon class="w-6 h-6 cursor-pointer" @click="swapLanguage"></LanguageIcon>
        <label class="swap swap-rotate">
          <input type="checkbox" class="theme-controller" v-model="isDark" value="dark" />
          <SunIcon class="swap-off h-6 w-6 fill-current" />
          <MoonIcon class="swap-on h-6 w-6 fill-current" />
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { version } from '@/api';
import { i18n } from '@/i18n';
import { isDark, LANG, language } from '@/store/config';
import { activeConnections, downloadTotal, memory, uploadTotal } from '@/store/connections';
import { activeUuid, backendList } from '@/store/setup';
import { SunIcon, MoonIcon, LanguageIcon, PlusIcon } from '@heroicons/vue/24/outline';
import prettyBytes from 'pretty-bytes';
import { computed } from 'vue';

const downloadSpeedTotal = computed(() => {
  return activeConnections.value.reduce((total, conn) => {
    return total + conn.downloadSpeed
  }, 0)
})

const uploadSpeedTotal = computed(() => {
  return activeConnections.value.reduce((total, conn) => {
    return total + conn.uploadSpeed
  }, 0)
})

const opts = computed(() => {
  return backendList.value.map((b) => {
    return {
      label: `${b.protocol}://${b.host}:${b.port}`,
      value: b.uuid
    }
  })
})

const addBackend = () => {
  activeUuid.value = null
}

const swapLanguage = () => {
  language.value = language.value === LANG.ZH_CN ? LANG.EN_US : LANG.ZH_CN
  i18n.global.locale = language.value
}

</script>