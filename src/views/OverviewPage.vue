<template>
  <div class="flex flex-col gap-2 overflow-y-auto p-2">
    <!-- overview -->
    <div class="card card-compact w-full">
      <div class="card-title px-4 pt-4">
        {{ $t('overview') }}
      </div>
      <div class="card-body gap-4">
        <StatisticsStats />
        <div class="grid grid-cols-1 gap-2 xl:grid-cols-3">
          <SpeedCharts class="sm:h-64" />
          <MemoryCharts class="sm:h-64" />
          <ConnectionsCharts class="sm:h-64" />
        </div>
      </div>
    </div>
    <div class="card card-compact w-full">
      <div class="card-title px-4 pt-4">
        {{ $t('networkInfo') }}
      </div>
      <div class="card-body gap-4">
        <div class="grid grid-cols-1 gap-2 lg:grid-cols-2">
          <IPCheck />
          <ConnectionStatus />
        </div>
      </div>
    </div>
    <div class="flex-1"></div>
    <div class="card items-center justify-center gap-2 p-2 sm:flex-row">
      {{ getUrlFromBackend(activeBackend!) }}
      <BackendVersion />
    </div>
  </div>
</template>

<script setup lang="ts">
import BackendVersion from '@/components/common/BackendVersion.vue'
import ConnectionsCharts from '@/components/overview/ConnectionsCharts.vue'
import ConnectionStatus from '@/components/overview/ConnectionStatus.vue'
import IPCheck from '@/components/overview/IPCheck.vue'
import MemoryCharts from '@/components/overview/MemoryCharts.vue'
import SpeedCharts from '@/components/overview/SpeedCharts.vue'
import StatisticsStats from '@/components/overview/StatisticsStats.vue'
import { getUrlFromBackend } from '@/helper'
import { activeBackend } from '@/store/setup'
</script>
