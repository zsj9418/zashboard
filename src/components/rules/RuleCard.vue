<template>
  <div class="card mb-1 block p-2 text-sm">
    <span class="mr-2">{{ index }}:</span>
    <span class="mr-2 text-slate-500">{{ rule.type }}</span>
    <span class="mr-2">-></span>
    <span class="text-primary">{{ rule.proxy }}</span>
    <span
      class="badge block h-auto rounded-lg bg-base-200"
      v-if="rule.payload"
    >
      {{ rule.payload }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Rule } from '@/types'

defineProps<{
  rule: Rule
  index: number
}>()
</script>
