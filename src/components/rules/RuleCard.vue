<template>
  <div class="card w-full flex-row gap-1 bg-base-100 p-2 text-sm shadow-xl">
    <div class="w-20 text-primary">{{ rule.proxy }}</div>
    <div class="flex-1">{{ rule.payload }}</div>
  </div>
</template>

<script setup lang="ts">
import type { Rule } from '@/types'

defineProps<{
  rule: Rule
}>()
</script>
