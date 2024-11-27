<template>
  <div class="flex h-full flex-col gap-1 overflow-y-auto overflow-x-hidden p-2">
    <RulesCtrl
      v-if="isSiderbarCollapsed"
      :horizontal="true"
    />
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
import RulesCtrl from '@/components/sidebar/RulesCtrl.vue'
import { RULE_TAB_TYPE } from '@/config'
import { isSiderbarCollapsed, rulesTabShow } from '@/store/config'
import { ruleProviderList, rules } from '@/store/rules'
</script>
