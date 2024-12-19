<template>
  <div :class="twMerge('card mb-1 gap-1 p-2 text-sm', !rule.payload && 'flex-row gap-0')">
    <div>
      <span class="mr-2">{{ index }}:</span>
      <span v-if="rule.payload">
        {{ rule.payload }}
      </span>
    </div>
    <div class="flex gap-2">
      <span :class="rule.payload && 'text-slate-500'">{{ rule.type }}</span>
      <span>-></span>
      <span class="text-primary">{{ rule.proxy }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Rule } from '@/types'
import { twMerge } from 'tailwind-merge'

defineProps<{
  rule: Rule
  index: number
}>()
</script>
