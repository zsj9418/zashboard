<template>
  <div :class="twMerge('card mb-1 gap-1 p-2 text-sm', !rule.payload && 'flex-row gap-0')">
    <div>
      <span class="mr-2 inline-block min-w-4 text-center">{{ index }}.</span>
      <span
        class="mr-2"
        v-if="rule.payload"
      >
        {{ rule.payload }}
      </span>
      <span
        v-if="typeof rule.size === 'number' && rule.size !== -1"
        class="badge badge-sm bg-base-200"
      >
        {{ rule.size }}
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
