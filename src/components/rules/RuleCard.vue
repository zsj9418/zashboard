<template>
  <div class="card w-full flex-row gap-1 rounded-xl bg-base-100 p-2 text-sm shadow-lg">
    <div class="min-w-32 text-primary">{{ rule.proxy }}</div>
    <div class="flex-1">{{ rule.payload }}</div>
  </div>
</template>

<script setup lang="ts">
import type { Rule } from '@/types'

defineProps<{
  rule: Rule
}>()
</script>
