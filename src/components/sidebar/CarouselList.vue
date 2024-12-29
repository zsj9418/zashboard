<template>
  <div class="card carousel carousel-vertical h-28 text-sm">
    <IPCheck class="carousel-item box-border" />
    <ConnectionStatus class="carousel-item box-border" />
    <div
      class="carousel-item box-border"
      ref="speedCharts"
    >
      <SpeedCharts />
    </div>
    <MemoryCharts class="carousel-item box-border" />
    <ConnectionsCharts class="carousel-item box-border" />
  </div>
</template>

<script setup lang="ts">
import ConnectionsCharts from '@/components/statistics/ConnectionsCharts.vue'
import ConnectionStatus from '@/components/statistics/ConnectionStatus.vue'
import IPCheck from '@/components/statistics/IPCheck.vue'
import MemoryCharts from '@/components/statistics/MemoryCharts.vue'
import SpeedCharts from '@/components/statistics/SpeedCharts.vue'
import { onMounted, ref } from 'vue'

const speedCharts = ref()

onMounted(() => {
  if (speedCharts.value) {
    speedCharts.value.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }
})
</script>
