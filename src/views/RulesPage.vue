<template>
  <div class="flex h-full flex-col gap-[2px] overflow-y-auto overflow-x-hidden p-2">
    <div
      v-for="rule in rules"
      :key="rule.payload"
      class="card w-full flex-row gap-1 bg-base-100 p-2 text-sm shadow-xl"
    >
      <div class="w-20 text-primary">{{ rule.proxy }}</div>
      <div class="flex-1">{{ rule.payload }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { rules } from '@/store/rules'
</script>
