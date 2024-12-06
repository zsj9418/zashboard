<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { theme } from './store/settings'
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
</script>

<template>
  <div
    ref="app"
    class="font-twemoji flex h-dvh w-screen overflow-x-hidden bg-base-100"
    :data-theme="theme"
  >
    <SetupPage v-if="!activeBackend"></SetupPage>
    <Home v-else></Home>
  </div>
</template>
