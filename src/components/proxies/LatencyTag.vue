<template>
  <div class="badge flex w-8 items-center justify-center shadow-sm">
    <div
      :class="twMerge('text-xs', color)"
      ref="latencyRef"
      v-show="latency > 0"
    />
    <BoltIcon
      v-show="latency === 0"
      class="h-4 w-4"
    />
  </div>
</template>

<script setup lang="ts">
import { getLatencyByName } from '@/store/proxies'
import { lowLatency, mediumLatency } from '@/store/settings'
import { BoltIcon } from '@heroicons/vue/24/outline'
import { CountUp } from 'countup.js'
import { twMerge } from 'tailwind-merge'
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  name: string
}>()
const latencyRef = ref()
const latency = computed(() => getLatencyByName(props.name))
let countUp: CountUp | null = null

onMounted(() => {
  countUp = new CountUp(latencyRef.value, latency.value, {
    duration: 1,
    separator: '',
    enableScrollSpy: true,
  })
  countUp.start()

  watch(latency, () => {
    countUp?.update(latency.value)
  })
})

const color = computed(() => {
  if (latency.value < lowLatency.value) {
    return 'text-green-500'
  } else if (latency.value < mediumLatency.value) {
    return 'text-yellow-500'
  } else {
    return 'text-red-500'
  }
})
</script>
