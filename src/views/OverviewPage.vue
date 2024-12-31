<template>
  <div class="flex flex-col gap-2 overflow-y-auto p-2">
    <ChartsCard />
    <NetworkCard />
    <div class="flex-1"></div>
    <div class="card items-center justify-center gap-2 p-2 sm:flex-row">
      {{ getUrlFromBackend(activeBackend!) }}
      <BackendVersion />
    </div>
  </div>
</template>

<script setup lang="ts">
import BackendVersion from '@/components/common/BackendVersion.vue'
import ChartsCard from '@/components/overview/ChartsCard.vue'
import NetworkCard from '@/components/overview/NetworkCard.vue'

import { getUrlFromBackend } from '@/helper'
import { activeBackend } from '@/store/setup'
</script>
