<template>
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
            {{ opt === 'default' ? $t('autoSwitch') : opt }}
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
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
        {{ $t('customBackgroundURL') }}:
        <input
          class="input input-sm input-bordered min-w-64"
          v-model="customBackgroundURL"
        />
      </div>
      <div
        class="flex items-center gap-2"
        v-if="customBackgroundURL"
      >
        {{ $t('transparent') }}:
        <input
          type="range"
          min="0"
          max="100"
          v-model="dashboardTransparent"
          class="range max-w-64"
        />
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
</template>

<script setup lang="ts">
import { isSingBox, upgradeUIAPI, zashboardVersion } from '@/api'
import LanguageSelect from '@/components/settings/LanguageSelect.vue'
import { useSettings } from '@/composables/settings'
import { FONTS } from '@/config'
import { exportSettings, importSettings } from '@/helper'
import {
  autoUpgrade,
  customBackgroundURL,
  dashboardTransparent,
  font,
  theme,
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
