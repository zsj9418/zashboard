<template>
  <div class="flex h-full flex-col gap-[2px] overflow-y-auto overflow-x-hidden p-2">
    <template v-if="rulesTabShow === RULE_TAB_TYPE.PROVIDER">
      <RuleProvider
        v-for="ruleProvider in ruleProviderList"
        :key="ruleProvider.name"
        :ruleProvider="ruleProvider"
      />
    </template>
    <template v-else>
      <RuleCard
        v-for="rule in rules"
        :key="rule.payload"
        :rule="rule"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import RuleCard from '@/components/rules/RuleCard.vue'
import RuleProvider from '@/components/rules/RuleProvider.vue'
import { RULE_TAB_TYPE, rulesTabShow } from '@/store/config'
import { ruleProviderList, rules } from '@/store/rules'
</script>
