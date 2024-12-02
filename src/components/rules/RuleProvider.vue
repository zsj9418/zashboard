<template>
  <div
    class="card w-full flex-row items-center gap-2 rounded-xl bg-base-100 p-1 px-2 text-sm shadow-lg"
  >
    <div class="flex flex-1 flex-col sm:flex-row">
      <div class="w-48 flex-1 text-primary">
        {{ ruleProvider.name }} ({{ ruleProvider.ruleCount }})
      </div>
      <div class="flex gap-1">
        <span>{{ ruleProvider.behavior }}</span>
        <span>{{ ruleProvider.vehicleType }}</span>
        <span>{{ $t('updated') }} {{ fromNow(ruleProvider.updatedAt) }}</span>
      </div>
    </div>
    <button
      :class="twMerge('btn btn-circle btn-xs', isUpdating ? 'animate-spin' : '')"
      @click="updateRuleProviderClickHandler"
    >
      <ArrowPathIcon class="h-4 w-4" />
    </button>
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
