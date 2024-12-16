<template>
  <div
    :class="
      twMerge('flex h-4 w-8 items-center justify-center rounded-lg bg-base-100 text-xs', color)
    "
    ref="latencyRef"
  >
    <BoltIcon
      v-if="latency === 0"
      class="h-3 w-3 text-base-content"
    />
    <template v-else>
      {{ latency }}
    </template>
  </div>
</template>

<script setup lang="ts">
import { NOT_CONNECTED } from '@/config'
import { getLatencyByName } from '@/store/proxies'
import { lowLatency, mediumLatency } from '@/store/settings'
import { BoltIcon } from '@heroicons/vue/24/outline'
import { CountUp } from 'countup.js'
import { twMerge } from 'tailwind-merge'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps<{
  name: string
}>()
const latencyRef = ref()
const latency = computed(() => getLatencyByName(props.name))

let countUp: CountUp | null = null

onMounted(() => {
  setTimeout(() => {
    watch(latency, (value, OldValue) => {
      if (!countUp) {
        countUp = new CountUp(latencyRef.value, latency.value, {
          duration: 1,
          separator: '',
          enableScrollSpy: false,
          startVal: OldValue,
        })
      }

      countUp?.update(value)
    })
  })
})

onUnmounted(() => {
  countUp = null
})

const color = computed(() => {
  if (latency.value === NOT_CONNECTED) {
    return ''
  } else if (latency.value < lowLatency.value) {
    return 'text-green-500'
  } else if (latency.value < mediumLatency.value) {
    return 'text-yellow-500'
  } else {
    return 'text-red-500'
  }
})
</script>
