<template>
  <div class="grid grid-cols-1 gap-2 p-2">
    <ZashboardSettings />

    <template v-if="!splitOverviewPage">
      <!-- overview -->
      <div class="card card-compact">
        <div class="card-title px-4 pt-4">
          {{ $t('overview') }}
        </div>
        <div
          :class="`card-body grid grid-cols-1 gap-2 lg:grid-cols-2 ${showIPAndConnectionInfo && 'xl:grid-cols-3'}`"
        >
          <StatisticsInfo class="bg-base-200/40 p-4" />
          <template v-if="showIPAndConnectionInfo">
            <IPCheck />
            <ConnectionStatus />
          </template>
          <SpeedCharts />
          <MemoryCharts />
          <ConnectionsCharts />
        </div>
      </div>
    </template>

    <BackendSettings />
    <ProxiesSettings />
    <ConnectionsSettings />

    <!-- overview -->
    <div class="card card-compact">
      <div class="card-title px-4 pt-4">
        {{ $t('overview') }}
      </div>
      <div class="card-body grid grid-cols-1 gap-2 lg:grid-cols-2">
        <div class="flex items-center gap-2">
          {{ $t('splitOverviewPage') }}:
          <input
            class="toggle"
            type="checkbox"
            v-model="splitOverviewPage"
          />
        </div>
        <div
          class="flex items-center gap-2"
          v-if="!splitOverviewPage"
        >
          {{ $t('showIPAndConnectionInfo') }}:
          <input
            class="toggle"
            type="checkbox"
            v-model="showIPAndConnectionInfo"
          />
        </div>
        <div class="flex items-center gap-2">
          {{ $t('autoIPCheckWhenStart') }}:
          <input
            class="toggle"
            type="checkbox"
            v-model="autoIPCheck"
          />
        </div>
        <div class="flex items-center gap-2">
          {{ $t('autoConnectionCheckWhenStart') }}:
          <input
            class="toggle"
            type="checkbox"
            v-model="autoConnectionCheck"
          />
        </div>
        <div class="flex items-center gap-2">
          {{ $t('showStatisticsWhenSidebarCollapsed') }}:
          <input
            class="toggle"
            type="checkbox"
            v-model="showStatisticsWhenSidebarCollapsed"
          />
        </div>
      </div>
    </div>

    <!-- logs -->
    <div class="card card-compact">
      <div class="card-title px-4 pt-4">
        {{ $t('logs') }}
      </div>
      <div class="card-body">
        <div class="flex items-center gap-2">
          {{ $t('logRetentionLimit') }}:
          <input
            class="input input-sm input-bordered w-20"
            type="number"
            max="9999"
            v-model="logRetentionLimit"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ConnectionsCharts from '@/components/overview/ConnectionsCharts.vue'
import ConnectionStatus from '@/components/overview/ConnectionStatus.vue'
import IPCheck from '@/components/overview/IPCheck.vue'
import MemoryCharts from '@/components/overview/MemoryCharts.vue'
import SpeedCharts from '@/components/overview/SpeedCharts.vue'
import BackendSettings from '@/components/settings/BackendSettings.vue'
import ConnectionsSettings from '@/components/settings/ConnectionsSettings.vue'
import ProxiesSettings from '@/components/settings/ProxiesSettings.vue'
import ZashboardSettings from '@/components/settings/ZashboardSettings.vue'
import StatisticsInfo from '@/components/sidebar/StatisticsInfo.vue'
import {
  autoConnectionCheck,
  autoIPCheck,
  logRetentionLimit,
  showIPAndConnectionInfo,
  showStatisticsWhenSidebarCollapsed,
  splitOverviewPage,
} from '@/store/settings'
</script>
