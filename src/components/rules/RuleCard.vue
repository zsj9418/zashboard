<template>
  <div class="card mb-1 block w-full gap-2 p-2 text-sm">
    <span>{{ rule.type }}</span>
    <span class="mx-2">{{ rule.payload }}</span>
    <span class="min-w-32 text-primary">-> {{ rule.proxy }}</span>
  </div>
</template>

<script setup lang="ts">
import type { Rule } from '@/types'

defineProps<{
  rule: Rule
}>()
</script>
