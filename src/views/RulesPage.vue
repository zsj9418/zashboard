<template>
  <div class="flex flex-col gap-1 overflow-y-auto overflow-x-hidden">
    <template v-if="rulesTabShow === RULE_TAB_TYPE.PROVIDER">
      <RuleProvider
        v-for="ruleProvider in ruleProviderList"
        :key="ruleProvider.name"
        :ruleProvider="ruleProvider"
      />
    </template>
    <template v-else>
      <VirtualScroller :data="rules">
        <template v-slot="{ item: rule }: { item: Rule }">
          <RuleCard
            :key="rule.payload"
            :rule="rule"
          />
        </template>
      </VirtualScroller>
    </template>
  </div>
</template>

<script setup lang="ts">
import VirtualScroller from '@/components/common/VirtualScroller.vue'
import RuleCard from '@/components/rules/RuleCard.vue'
import RuleProvider from '@/components/rules/RuleProvider.vue'
import { rulesTabShow } from '@/composables/rules'
import { RULE_TAB_TYPE } from '@/config'
import { ruleProviderList, rules } from '@/store/rules'
import type { Rule } from '@/types'
</script>
