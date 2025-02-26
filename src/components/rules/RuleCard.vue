<template>
  <div class="card gap-2 p-2 text-sm">
    <div>
      <span class="mr-2">{{ index }}.</span>
      <span class="mr-2">{{ rule.type }}</span>
      <span
        class="mr-2 text-primary"
        v-if="rule.payload"
      >
        {{ rule.payload }}
      </span>
      <span
        v-if="typeof size === 'number' && size !== -1"
        class="badge badge-sm bg-base-200"
      >
        {{ size }}
      </span>
    </div>
    <div class="flex items-center gap-1 text-base-content/80">
      <ProxyName
        :name="rule.proxy"
        class="text-xs"
      />
      <template v-if="proxyNode?.now">
        <ArrowRightCircleIcon class="h-4 w-4" />
        <ProxyName
          :name="getNowProxyNodeName(rule.proxy)"
          class="text-xs"
        />
      </template>
      <span
        v-if="latency !== NOT_CONNECTED"
        :class="latencyColor"
        class="ml-1 text-xs"
      >
        {{ latency }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NOT_CONNECTED } from '@/constant'
import { getColorForLatency } from '@/helper'
import { getLatencyByName, getNowProxyNodeName, proxyMap } from '@/store/proxies'
import { ruleProviderList } from '@/store/rules'
import type { Rule } from '@/types'
import { ArrowRightCircleIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'
import ProxyName from '../proxies/ProxyName.vue'

const props = defineProps<{
  rule: Rule
  index: number
}>()

const proxyNode = computed(() => proxyMap.value[props.rule.proxy])
const latency = computed(() => getLatencyByName(props.rule.proxy, props.rule.proxy))
const latencyColor = computed(() => getColorForLatency(Number(latency.value)))

const size = computed(() => {
  if (props.rule.type === 'RuleSet') {
    return ruleProviderList.value.find((provider) => provider.name === props.rule.payload)
      ?.ruleCount
  }

  return props.rule.size
})
</script>
