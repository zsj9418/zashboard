<template>
  <div class="badge flex w-8 items-center justify-center shadow-sm">
    <div
      :class="twMerge('text-xs', color)"
      v-if="latency > 0"
    >
      {{ latency }}
    </div>
    <BoltIcon
      v-else
      class="h-4 w-4"
    />
  </div>
</template>

<script setup lang="ts">
import { getLatencyByName } from '@/store/proxies'
import { lowLatency, mediumLatency } from '@/store/settings'
import { BoltIcon } from '@heroicons/vue/24/outline'
import { twMerge } from 'tailwind-merge'
import { computed } from 'vue'
const props = defineProps<{
  name: string
}>()

const latency = computed(() => getLatencyByName(props.name))
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
