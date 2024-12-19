<template>
  <div class="flex flex-col gap-2 p-2 text-xs">
    <StatisticsInfo />
    <BackendVersion />

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
import { isSiderbarCollapsed } from '@/store/settings'
import { ArrowLeftCircleIcon } from '@heroicons/vue/24/outline'
import BackendVersion from '../common/BackendVersion.vue'
import BackendSwitch from '../settings/BackendSwitch.vue'
import StatisticsInfo from './StatisticsInfo.vue'
</script>
