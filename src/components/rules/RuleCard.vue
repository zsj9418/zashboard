<template>
  <div class="card mb-1 flex-row gap-1 p-2 text-sm">
    <span>{{ rule.type }}</span>
    <span v-if="rule.payload"> : {{ rule.payload }} </span>
    <span>-></span>
    <span class="text-primary">{{ rule.proxy }}</span>
  </div>
</template>

<script setup lang="ts">
import type { Rule } from '@/types'

defineProps<{
  rule: Rule
}>()
</script>
