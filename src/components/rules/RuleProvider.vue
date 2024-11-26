<template>
  <div>
    <div
      class="card w-full flex-row items-center gap-1 rounded-xl bg-base-100 p-1 px-2 text-sm shadow-lg"
    >
      <span class="w-48 flex-1 text-primary">
        {{ ruleProvider.name }} ({{ ruleProvider.ruleCount }})
      </span>
      <span class="w-16">{{ ruleProvider.behavior }}</span>
      <span class="w-16">{{ ruleProvider.vehicleType }}</span>
      <span class="w-48">{{ $t('updated') }} {{ fromNow(ruleProvider.updatedAt) }}</span>
      <button
        :class="twMerge('btn btn-circle btn-xs', isUpdating ? 'animate-spin' : '')"
        @click="updateRuleProviderClickHandler"
      >
        <ArrowPathIcon class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { updateRuleProviderAPI } from '@/api'
import { fromNow } from '@/helper'
import { fetchRules } from '@/store/rules'
import type { RuleProvider } from '@/types'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'
import { twMerge } from 'tailwind-merge'
import { ref } from 'vue'
const isUpdating = ref(false)
const props = defineProps<{
  ruleProvider: RuleProvider
}>()

const updateRuleProviderClickHandler = async () => {
  if (isUpdating.value) return

  isUpdating.value = true
  await updateRuleProviderAPI(props.ruleProvider.name)
  fetchRules()
  isUpdating.value = false
}
</script>
