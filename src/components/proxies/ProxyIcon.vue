<template>
  <div
    v-if="isDom"
    :class="['inline-block', fill || 'fill-primary', style]"
    v-html="pureDom"
  />
  <img
    v-else
    :class="style"
    :src="icon"
  />
</template>

<script setup lang="ts">
import DOMPurify from 'dompurify'
import { computed } from 'vue'

const props = defineProps<{
  icon: string
  fill?: string
  size?: string
}>()

const style = computed(() => {
  return props.size === 'small' ? 'w-4' : 'w-5'
})
const DOM_STARTS_WITH = 'data:image/svg+xml,'
const isDom = computed(() => {
  return props.icon.startsWith(DOM_STARTS_WITH)
})

const pureDom = computed(() => {
  if (!isDom.value) return
  return DOMPurify.sanitize(props.icon.replace(DOM_STARTS_WITH, ''))
})
</script>
