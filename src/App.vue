<script setup lang="ts">
import { theme } from './store/settings'
import { activeBackend } from './store/setup'
import Home from './views/HomePage.vue'
import SetupPage from './views/SetupPage.vue'
</script>

<template>
  <div
    class="flex h-dvh w-screen overflow-x-hidden bg-base-100 font-twemoji"
    :data-theme="theme"
  >
    <SetupPage v-if="!activeBackend"></SetupPage>
    <Home v-else></Home>
  </div>
</template>
