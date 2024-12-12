<template>
  <div class="flex flex-col gap-2 p-2 text-xs">
    <StatisticsInfo />
    <div class="flex gap-1">
      {{ $t('version') }}:
      <img
        :src="isSingBox ? SingBoxLogo : MetacubexLogo"
        class="w-4"
      />
      {{ version }}
    </div>

    <div class="flex">
      <button
        class="btn btn-circle btn-ghost btn-xs"
        @click="isSiderbarCollapsed = true"
      >
        <ArrowLeftCircleIcon class="h-5 w-5" />
      </button>
      <div class="flex-1"></div>
      <BackendSwitch />
    </div>
  </div>
</template>

<script setup lang="ts">
import { isSingBox, version } from '@/api'
import MetacubexLogo from '@/assets/metacubex.jpeg'
import SingBoxLogo from '@/assets/sing-box.svg'
import { isSiderbarCollapsed } from '@/store/settings'
import { ArrowLeftCircleIcon } from '@heroicons/vue/24/outline'
import BackendSwitch from '../settings/BackendSwitch.vue'
import StatisticsInfo from './StatisticsInfo.vue'
</script>
