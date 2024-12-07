<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { FONTS } from './config'
import { font, theme } from './store/settings'
import { activeBackend } from './store/setup'
import Home from './views/HomePage.vue'
import SetupPage from './views/SetupPage.vue'

const app = ref<HTMLElement>()

onMounted(() => {
  const themeColor = getComputedStyle(app.value!).getPropertyValue('background-color').trim()
  const metaThemeColor = document.querySelector('meta[name="theme-color"]')
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', themeColor)
  }
})

const fontClassMap = {
  [FONTS.MI_SANS]: 'font-MiSans',
  [FONTS.SARASA_UI]: 'font-SarasaUI',
  [FONTS.PING_FANG]: 'font-PingFang',
  [FONTS.FIRA_SANS]: 'font-FiraSans',
  [FONTS.SYSTEM_UI]: 'font-SystemUI',
}
const fontClassName = computed(() => fontClassMap[font.value])
</script>

<template>
  <div
    ref="app"
    :class="`flex h-dvh w-screen overflow-x-hidden bg-base-100 ${fontClassName}`"
    :data-theme="theme"
  >
    <SetupPage v-if="!activeBackend"></SetupPage>
    <Home v-else></Home>
  </div>
</template>
