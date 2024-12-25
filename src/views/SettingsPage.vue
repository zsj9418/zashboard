<template>
  <div class="grid grid-cols-1 gap-2 overflow-y-auto p-2">
    <!-- dashboard -->
    <div class="card card-compact">
      <div class="card-title px-4 pt-4 text-primary">
        <div class="indicator">
          <span
            v-if="isUIUpdateAvailable"
            class="indicator-item flex"
          >
            <span class="badge badge-xs absolute animate-ping bg-secondary"></span>
            <span class="badge badge-xs bg-secondary"></span>
          </span>
          <a
            href="https://github.com/Zephyruso/zashboard"
            target="_blank"
            >zashboard v{{ zashboardVersion }}</a
          >
        </div>
      </div>
      <div class="card-body gap-4">
        <div class="flex items-center gap-2">
          {{ $t('theme') }}:
          <select
            class="select select-bordered select-sm w-48"
            v-model="theme"
          >
            <option
              v-for="opt in themes"
              :key="opt"
              :value="opt"
            >
              {{ opt }}
            </option>
          </select>
        </div>
        <LanguageSelect />
        <div class="flex items-center gap-2">
          {{ $t('fonts') }}:
          <select
            class="select select-bordered select-sm w-48"
            v-model="font"
          >
            <option
              v-for="opt in Object.values(FONTS)"
              :key="opt"
              :value="opt"
            >
              {{ opt }}
            </option>
          </select>
        </div>
        <div
          class="flex items-center gap-2"
          v-if="!isSingBox"
        >
          {{ $t('autoUpgrade') }}:
          <input
            class="toggle"
            type="checkbox"
            v-model="autoUpgrade"
          />
        </div>
        <div class="grid max-w-screen-md grid-cols-2 gap-2 sm:grid-cols-4">
          <template v-if="!isSingBox">
            <button
              :class="twMerge('btn btn-primary btn-sm', isUIUpgrading ? 'animate-pulse' : '')"
              @click="handlerClickUpgradeUI"
            >
              {{ $t('upgradeUI') }}
            </button>
            <div class="sm:hidden"></div>
          </template>

          <button
            class="btn btn-sm"
            @click="exportSettings"
          >
            {{ $t('exportSettings') }}
          </button>
          <button
            class="btn btn-sm"
            @click="importSettings"
          >
            {{ $t('importSettings') }}
          </button>
        </div>
      </div>
    </div>

    <!-- statistics -->
    <div class="card card-compact">
      <div class="card-title px-4 pt-4">
        {{ $t('statistics') }}
      </div>
      <div class="card-body gap-4">
        <div class="grid grid-cols-1 gap-2 lg:grid-cols-2">
          <div class="card flex items-center justify-start bg-base-200/40 p-4">
            <StatisticsInfo class="h-20 w-full" />
          </div>
          <SpeedCharts />
          <MemoryCharts />
          <ConnectionsCharts />
        </div>
      </div>
    </div>

    <BackendSettings />

    <!-- proxies -->
    <div class="card card-compact">
      <div class="card-title px-4 pt-4">
        {{ $t('proxies') }}
      </div>
      <div class="card-body grid grid-cols-1 gap-2 lg:grid-cols-2">
        <div class="flex items-center gap-2">
          {{ $t('proxyPreviewType') }}:
          <select
            class="select select-bordered select-sm"
            v-model="proxyPreviewType"
          >
            <option
              v-for="opt in Object.values(PROXY_PREVIEW_TYPE)"
              :key="opt"
              :value="opt"
            >
              {{ $t(opt) }}
            </option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          {{ $t('truncateProxyName') }}:
          <input
            class="toggle"
            type="checkbox"
            v-model="truncateProxyName"
          />
        </div>
        <div class="flex items-center gap-2">
          {{ $t('automaticDisconnection') }}:
          <input
            class="toggle"
            type="checkbox"
            v-model="automaticDisconnection"
          />
        </div>
        <div class="flex items-center gap-2 max-sm:hidden">
          {{ $t('twoColumnProxyGroup') }}:
          <input
            class="toggle"
            type="checkbox"
            v-model="twoColumnProxyGroup"
          />
        </div>
        <div class="flex w-full items-center gap-2">
          <span class="shrink-0"> {{ $t('speedtestUrl') }}: </span>
          <input
            type="text"
            class="input input-sm input-bordered w-60 flex-1 sm:max-w-80"
            v-model="speedtestUrl"
          />
        </div>
        <div class="flex w-full items-center gap-2">
          <span class="shrink-0"> {{ $t('speedtestTimeout') }}: </span>
          <input
            type="text"
            class="input input-sm input-bordered w-20"
            v-model="speedtestTimeout"
          />
          ms
        </div>
        <div class="flex items-center gap-2">
          <span class="shrink-0"> {{ $t('lowLatencyDesc') }}: </span>
          <input
            type="number"
            class="input input-sm input-bordered w-20"
            v-model="lowLatency"
          />
          ms
        </div>
        <div class="flex items-center gap-2">
          <span class="shrink-0"> {{ $t('mediumLatencyDesc') }}: </span>
          <input
            type="number"
            class="input input-sm input-bordered w-20"
            v-model="mediumLatency"
          />
          ms
        </div>
        <div class="flex items-center gap-2">
          {{ $t('ipv6Test') }}:
          <input
            class="toggle"
            type="checkbox"
            v-model="IPv6test"
          />
        </div>
        <div
          v-if="isSingBox"
          class="flex items-center gap-2"
        >
          {{ $t('showGlobalProxy') }}:
          <input
            class="toggle"
            type="checkbox"
            v-model="showGlobalProxy"
          />
        </div>
      </div>
    </div>

    <!-- connections -->
    <div class="card card-compact">
      <div class="card-title px-4 pt-4">
        {{ $t('connections') }}
      </div>
      <div class="card-body">
        <div class="flex items-center gap-2">
          {{ $t('connectionStyle') }}:
          {{ $t('table') }}
          <input
            class="toggle"
            type="checkbox"
            v-model="useConnectionCard"
          />
          {{ $t('card') }}
        </div>
        <div
          class="flex items-center gap-2 max-sm:hidden"
          v-if="useConnectionCard"
        >
          {{ $t('compactCard') }}:
          <input
            class="toggle"
            type="checkbox"
            v-model="compactConnectionCard"
          />
        </div>
        <TableSettings v-else />
        <div class="divider"></div>
        <SourceIPLabels />
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
import { isSingBox, upgradeUIAPI, zashboardVersion } from '@/api'
import BackendSettings from '@/components/settings/BackendSettings.vue'
import LanguageSelect from '@/components/settings/LanguageSelect.vue'
import SourceIPLabels from '@/components/settings/SourceIPLabels.vue'
import TableSettings from '@/components/settings/TableSettings.vue'
import StatisticsInfo from '@/components/sidebar/StatisticsInfo.vue'
import ConnectionsCharts from '@/components/statistics/ConnectionsCharts.vue'
import MemoryCharts from '@/components/statistics/MemoryCharts.vue'
import SpeedCharts from '@/components/statistics/SpeedCharts.vue'
import { useSettings } from '@/composables/settings'
import { FONTS, PROXY_PREVIEW_TYPE } from '@/config'
import { exportSettings, importSettings } from '@/helper'
import {
  automaticDisconnection,
  autoUpgrade,
  compactConnectionCard,
  font,
  IPv6test,
  logRetentionLimit,
  lowLatency,
  mediumLatency,
  proxyPreviewType,
  showGlobalProxy,
  speedtestTimeout,
  speedtestUrl,
  theme,
  truncateProxyName,
  twoColumnProxyGroup,
  useConnectionCard,
} from '@/store/settings'
import { twMerge } from 'tailwind-merge'
import { ref } from 'vue'

const { isUIUpdateAvailable } = useSettings()

const isUIUpgrading = ref(false)
const handlerClickUpgradeUI = async () => {
  if (isUIUpgrading.value) return
  isUIUpgrading.value = true
  try {
    await upgradeUIAPI()
    isUIUpgrading.value = false
    window.location.reload()
  } catch {
    isUIUpgrading.value = false
  }
}

const themes = [
  'default',
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter',
  'dim',
  'nord',
  'sunset',
]
</script>
