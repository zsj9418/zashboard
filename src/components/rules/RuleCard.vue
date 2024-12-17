<template>
  <div class="card mb-1 block p-2 text-sm">
    <span class="mr-1">{{ rule.type }}</span>
    <span
      class="mr-1"
      v-if="rule.payload"
      >: {{ rule.payload }}</span
    >
    <span class="mr-1">-></span>
    <span class="text-primary">{{ rule.proxy }}</span>
  </div>
</template>

<script setup lang="ts">
import type { Rule } from '@/types'

defineProps<{
  rule: Rule
}>()
</script>
