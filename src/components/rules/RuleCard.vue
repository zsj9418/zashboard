<template>
  <div :class="twMerge('card mb-1 gap-1 p-2 text-sm', !rule.payload && 'flex-row gap-0')">
    <div>
      <span class="mr-2 inline-block min-w-4 text-center">{{ index }}.</span>
      <span
        class="mr-2"
        v-if="rule.payload"
      >
        {{ rule.payload }}
      </span>
      <span
        v-if="typeof rule.size === 'number' && rule.size !== -1"
        class="badge badge-sm bg-base-200"
      >
        {{ rule.size }}
      </span>
    </div>
    <span class="flex gap-2">
      <span class="text-primary">{{ rule.proxy }}</span>
      <span
        v-if="latency > NOT_CONNECTED"
        :class="latencyColor"
        >{{ latency }}ms</span
      >
    </span>
  </div>
</template>

<script setup lang="ts">
import { NOT_CONNECTED } from '@/config'
import { getColorForLatency } from '@/helper'
import { getLatencyByName } from '@/store/proxies'
import type { Rule } from '@/types'
import { twMerge } from 'tailwind-merge'
import { computed } from 'vue'

const props = defineProps<{
  rule: Rule
  index: number
}>()

const latency = computed(() => getLatencyByName(props.rule.proxy))
const latencyColor = computed(() => getColorForLatency(Number(latency.value)))
</script>
