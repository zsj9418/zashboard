<template>
  <div :class="twMerge('card mb-1 gap-1 p-2 text-sm', !rule.payload && 'gap-0')">
    <div>
      <span class="mr-2 inline-block min-w-4 text-center">{{ index }}.</span>
      <span class="mr-2 text-slate-500">{{ rule.type }}:</span>
      <span
        class="mr-2 text-primary"
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
    <div class="flex items-center gap-2">
      <ProxyName :name="rule.proxy" />
      <template v-if="proxyNode?.now">
        <ArrowRightCircleIcon class="h-4 w-4" />
        <ProxyName :name="proxyNode.now" />
      </template>
      <span :class="latencyColor">{{ latency }}ms</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getColorForLatency } from '@/helper'
import { getLatencyByName, proxyMap } from '@/store/proxies'
import type { Rule } from '@/types'
import { ArrowRightCircleIcon } from '@heroicons/vue/24/outline'
import { twMerge } from 'tailwind-merge'
import { computed } from 'vue'
import ProxyName from '../proxies/ProxyName.vue'

const props = defineProps<{
  rule: Rule
  index: number
}>()

const proxyNode = computed(() => proxyMap.value[props.rule.proxy])
const latency = computed(() => getLatencyByName(props.rule.proxy))
const latencyColor = computed(() => getColorForLatency(Number(latency.value)))
</script>
