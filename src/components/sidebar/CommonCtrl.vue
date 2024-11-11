<template>
  <div class="flex">
    <div class="text-xs flex flex-col gap-2 p-2">
      <div>{{ $t('download') }} {{ prettyBytes(downloadTotal) }}</div>
      <div>{{ $t('upload') }} {{ prettyBytes(uploadTotal) }}</div>
      <div>{{ $t('memoryUsage') }} {{ prettyBytes(memory) }}</div>
      <div>{{ $t('version') }} {{ version }}</div>
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
</template>

<script setup lang="ts">
import { version } from '@/api';
import { i18n } from '@/i18n';
import { isDark, LANG, language } from '@/store/config';
import { downloadTotal, memory, uploadTotal } from '@/store/connections';
import { SunIcon, MoonIcon, LanguageIcon } from '@heroicons/vue/24/outline';
import prettyBytes from 'pretty-bytes';

const swapLanguage = () => {
  language.value = language.value === LANG.ZH_CN ? LANG.EN_US : LANG.ZH_CN
  i18n.global.locale = language.value
}

</script>