<template>
  <div :class="twMerge(`flex flex-col gap-2 p-2`, `${horizontal && 'flex-row'}`)">
    <div
      :class="twMerge('flex flex-col-reverse gap-2', horizontal && 'flex-row')"
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
          :class="twMerge('btn btn-sm')"
          @click="handlerClickUpgradeAllProviders"
        >
          <span
            v-if="isUpgrading"
            class="loading loading-dots loading-md"
          ></span>
          <template v-else>
            {{ $t('updateAllProviders') }}
          </template>
        </button>
      </div>
    </div>
    <TextInput
      class="w-full max-w-96"
      v-model="rulesFilter"
    />
  </div>
</template>

<script setup lang="ts">
import { updateRuleProviderAPI } from '@/api'
import { rulesTabShow } from '@/composables/rules'
import { RULE_TAB_TYPE } from '@/config'
import { fetchRules, ruleProviderList, rulesFilter } from '@/store/rules'
import { twMerge } from 'tailwind-merge'
import { ref } from 'vue'
import TextInput from '../common/TextInput.vue'

defineProps<{
  horizontal?: boolean
}>()

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
    await fetchRules()
    isUpgrading.value = false
  }
}
</script>
