<template>
  <div
    class="card carousel carousel-vertical h-28 shrink-0 overflow-x-hidden text-sm hover:scrollbar-thin"
  >
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
import ConnectionsCharts from '@/components/overview/ConnectionsCharts.vue'
import ConnectionStatus from '@/components/overview/ConnectionStatus.vue'
import IPCheck from '@/components/overview/IPCheck.vue'
import MemoryCharts from '@/components/overview/MemoryCharts.vue'
import SpeedCharts from '@/components/overview/SpeedCharts.vue'
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
