<template>
  <div class="flex flex-col gap-1 overflow-y-auto p-2">
    <div class="card card-compact bg-base-100 shadow-lg">
      <div class="card-title px-4 pt-4 text-primary">
        <a
          href="https://github.com/Zephyruso/zashboard"
          target="_blank"
          >zashboard v{{ zashboardVersion }}</a
        >
      </div>
      <div class="card-body gap-4">
        <div class="flex items-center gap-2">
          {{ $t('theme') }}:
          <select
            class="select select-bordered select-xs w-48"
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
        <div class="flex items-center gap-2">
          {{ $t('language') }}:
          <select
            class="select select-bordered select-xs w-48"
            v-model="language"
            @change="() => (i18n.global.locale = language)"
          >
            <option
              v-for="opt in Object.values(LANG)"
              :key="opt"
              :value="opt"
              :label="$t(opt)"
            />
          </select>
        </div>
        <div v-if="!isSingBox">
          <button
            :class="twMerge('btn btn-primary btn-sm', isUIUpgrading ? 'animate-pulse' : '')"
            @click="handlerClickUpgradeUI"
          >
            {{ $t('upgradeUI') }}
          </button>
        </div>
      </div>
    </div>
    <div class="card card-compact bg-base-100 shadow-lg">
      <div class="card-title px-4 pt-4">
        {{ $t('backend') }}
      </div>
      <div class="card-body gap-4">
        <BackendSwitch />
        <div class="flex items-center gap-2">
          <button
            v-if="!isSingBox"
            :class="twMerge('btn btn-primary btn-sm', isCoreUpgrading ? 'animate-pulse' : '')"
            @click="handlerClickUpgradeCore"
          >
            {{ $t('upgradeCore') }}
          </button>
          <button
            :class="twMerge('btn btn-sm', isConfigReloading ? 'animate-pulse' : '')"
            @click="handlerClickReloadConfigs"
          >
            {{ $t('reloadConfigs') }}
          </button>
          <button
            class="btn btn-sm"
            @click="flushFakeIPAPI"
          >
            {{ $t('flushFakeIP') }}
          </button>
        </div>
      </div>
    </div>
    <div class="card card-compact bg-base-100 shadow-lg">
      <div class="card-title px-4 pt-4">
        {{ $t('proxies') }}
      </div>
      <div class="card-body">
        <div class="flex items-center gap-2">
          {{ $t('automaticDisconnection') }}:
          <input
            class="toggle"
            type="checkbox"
            v-model="automaticDisconnection"
          />
        </div>
        <div class="flex items-center gap-2">
          {{ $t('showGlobalProxy') }}:
          <input
            class="toggle"
            type="checkbox"
            v-model="showGlobalProxy"
          />
        </div>
        <div class="flex items-center gap-2">
          {{ $t('twoColumns') }}:
          <input
            class="toggle"
            type="checkbox"
            v-model="twoColumns"
          />
        </div>
        <div class="flex items-center gap-2">
          {{ $t('twoColumnsInProxyGroupForMobile') }}:
          <input
            class="toggle"
            type="checkbox"
            v-model="twoColumnsInProxyGroupForMobile"
          />
        </div>
        <div class="flex max-w-96 items-center gap-2">
          {{ $t('speedtestUrl') }}:
          <input
            type="text"
            class="input input-sm input-bordered flex-1"
            v-model="speedtestUrl"
          />
        </div>
        <div class="flex max-w-96 items-center gap-2">
          {{ $t('speedtestTimeout') }}:
          <input
            type="text"
            class="input input-sm input-bordered flex-1"
            v-model="speedtestTimeout"
          />
        </div>
      </div>
    </div>
    <div class="card card-compact bg-base-100 shadow-lg">
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
          class="flex items-center gap-2"
          v-if="useConnectionCard"
        >
          {{ $t('compactCard') }}:
          <input
            class="toggle"
            type="checkbox"
            v-model="compactConnectionCard"
          />
        </div>
        <div
          v-else
          class="flex flex-col gap-2"
        >
          <div>{{ $t('customTableColumns') }}:</div>
          <TableSettings />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  flushFakeIPAPI,
  isSingBox,
  reloadConfigsAPI,
  upgradeCoreAPI,
  upgradeUIAPI,
  zashboardVersion,
} from '@/api'
import TableSettings from '@/components/connections/TableSettings.vue'
import BackendSwitch from '@/components/settings/BackendSwitch.vue'
import { LANG } from '@/config'
import { i18n } from '@/i18n'
import {
  automaticDisconnection,
  compactConnectionCard,
  language,
  showGlobalProxy,
  speedtestTimeout,
  speedtestUrl,
  theme,
  twoColumns,
  twoColumnsInProxyGroupForMobile,
  useConnectionCard,
} from '@/store/config'
import { twMerge } from 'tailwind-merge'
import { ref } from 'vue'

const isCoreUpgrading = ref(false)
const handlerClickUpgradeCore = async () => {
  if (isCoreUpgrading.value) return
  isCoreUpgrading.value = true
  try {
    await upgradeCoreAPI()
    isCoreUpgrading.value = false
  } catch {
    isCoreUpgrading.value = false
  }
}

const isUIUpgrading = ref(false)
const handlerClickUpgradeUI = async () => {
  if (isUIUpgrading.value) return
  isUIUpgrading.value = true
  try {
    await upgradeUIAPI()
    isUIUpgrading.value = false
  } catch {
    isUIUpgrading.value = false
  }
}

const isConfigReloading = ref(false)
const handlerClickReloadConfigs = async () => {
  if (isConfigReloading.value) return
  isConfigReloading.value = true
  try {
    await reloadConfigsAPI()
    isConfigReloading.value = false
  } catch {
    isConfigReloading.value = false
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
