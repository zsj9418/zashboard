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
  </div>
</template>

<script setup lang="ts">
import { RULE_TAB_TYPE, rulesTabShow } from '@/store/config'
import { ruleProviderList } from '@/store/rules'
</script>
