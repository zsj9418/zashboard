<script setup lang="ts">
import Home from './views/HomePage.vue';
import SetupPage from './views/SetupPage.vue';
import { activeBackend } from './store/setup';

</script>

<template>
  <div class="h-dvh w-screen overflow-x-hidden bg-base-100 flex">
    <SetupPage v-if="!activeBackend"></SetupPage>
    <Home v-else></Home>
  </div>
</template>
