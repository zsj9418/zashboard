<template>
  <DialogWrapper v-model="model">
    <div class="divider">Color</div>
    <div class="grid grid-cols-4 gap-2">
      <div
        v-for="color in colors"
        :key="color"
      >
        <label class="flex cursor-pointer flex-col items-center gap-1">
          <div class="flex h-6 items-center justify-center text-xs">
            {{ color.replace('--color-', '') }}
          </div>
          <div
            class="border-base-content h-6 w-6 rounded border-2"
            :style="`background-color: ${customTheme[color as keyof typeof customTheme]};`"
          ></div>
          <input
            class="h-1 w-1 opacity-0"
            :key="color"
            type="color"
            v-model="customTheme[color as keyof typeof customTheme]"
          />
        </label>
      </div>
    </div>
    <div class="divider">Radius</div>
    <div class="grid grid-cols-1 gap-2 md:grid-cols-3">
      <div
        v-for="radius in radiusKey"
        :key="radius"
        class="flex items-center gap-2"
      >
        {{ radius.replace('--radius-', '') }}
        <TextInput
          class="w-20"
          v-model="customTheme[radius as keyof typeof customTheme] as string"
        />
      </div>
    </div>
    <div class="divider">Size</div>
    <div class="grid grid-cols-1 gap-2 md:grid-cols-3">
      <div
        v-for="size in sizeKey"
        :key="size"
        class="flex items-center gap-2"
      >
        {{ size.replace('--size-', '') }}
        <TextInput
          class="w-20"
          v-model="customTheme[size as keyof typeof customTheme] as string"
        />
      </div>
      <div class="flex items-center gap-2">
        border
        <TextInput
          class="w-20"
          v-model="customTheme['--border']"
        />
      </div>
    </div>
    <div class="divider">Effect</div>
    <div class="grid grid-cols-1 gap-2 md:grid-cols-3">
      <div>
        depth
        <input
          class="toggle"
          v-model="depth"
          type="checkbox"
        />
      </div>
      <div>
        noise
        <input
          class="toggle"
          v-model="noise"
          type="checkbox"
        />
      </div>
      <div>
        dark
        <input
          class="toggle"
          v-model="dark"
          type="checkbox"
        />
      </div>
    </div>
    <div class="flex justify-end gap-2 pt-2">
      <a
        class="btn btn-sm"
        href="https://daisyui.com/theme-generator/"
        target="_blank"
      >
        {{ $t('moreDetails') }}
      </a>
      <button
        class="btn btn-sm btn-primary"
        @click="handlerCustomThemeSave"
      >
        {{ $t('save') }}
      </button>
    </div>
  </DialogWrapper>
</template>

<script setup lang="ts">
import { DEFAULT_THEME, type THEME } from '@/constant'
import { applyCustomThemes } from '@/helper'
import { customThemes, darkTheme, defaultTheme } from '@/store/settings'
import { v4 as uuid } from 'uuid'
import { computed, reactive } from 'vue'
import DialogWrapper from '../common/DialogWrapper.vue'
import TextInput from '../common/TextInput.vue'

const model = defineModel<boolean>('value', {
  default: false,
})

const customTheme = reactive(customThemes.value[0] || DEFAULT_THEME)
const colors = computed(() => {
  return Object.keys(customTheme).filter((key) => key.startsWith('--color-'))
})
const radiusKey = computed(() => {
  return Object.keys(customTheme).filter((key) => key.startsWith('--radius-'))
})
const sizeKey = computed(() => {
  return Object.keys(customTheme).filter((key) => key.startsWith('--size-'))
})

const depth = computed({
  get: () => customTheme['--depth'] === '1',
  set: (value) => {
    customTheme['--depth'] = value ? '1' : '0'
  },
})

const noise = computed({
  get: () => customTheme['--noise'] === '1',
  set: (value) => {
    customTheme['--noise'] = value ? '1' : '0'
  },
})

const dark = computed({
  get: () => customTheme['color-scheme'] === 'dark',
  set: (value) => {
    customTheme['color-scheme'] = value ? 'dark' : 'light'
  },
})

const handlerCustomThemeSave = () => {
  customThemes.value = [
    {
      ...customTheme,
      id: uuid(),
    } as THEME,
  ]

  defaultTheme.value = customTheme.name
  darkTheme.value = customTheme.name
  applyCustomThemes()
}
</script>
