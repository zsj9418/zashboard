<template>
  <div
    class="flex flex-col gap-2 p-2"
    v-if="ruleProviderList.length"
  >
    <div
      role="tablist"
      class="tabs-boxed tabs tabs-sm"
    >
      <a
        role="tab"
        class="tab"
        v-for="type in RULE_TAB_TYPE"
        :key="type"
        :class="{ 'tab-active': rulesTabShow === type }"
        @click="rulesTabShow = type"
      >
        {{ $t(type) }}</a
      >
    </div>
    <div
      class="flex flex-col gap-2"
      v-if="rulesTabShow === RULE_TAB_TYPE.PROVIDER"
    >
      <button
        :class="twMerge('btn btn-sm', isUpgrading ? 'animate-pulse' : '')"
        @click="handlerClickUpgradeAllProviders"
      >
        {{ $t('upgradeAllProviders') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { updateRuleProviderAPI } from '@/api'
import { RULE_TAB_TYPE, rulesTabShow } from '@/store/config'
import { fetchRules, ruleProviderList } from '@/store/rules'
import { twMerge } from 'tailwind-merge'
import { ref } from 'vue'

const isUpgrading = ref(false)
const handlerClickUpgradeAllProviders = async () => {
  if (isUpgrading.value) return
  isUpgrading.value = true
  try {
    await Promise.all(
      ruleProviderList.value.map((provider) => updateRuleProviderAPI(provider.name)),
    )
    await fetchRules()
    isUpgrading.value = false
  } catch {
    isUpgrading.value = false
  }
}
</script>
