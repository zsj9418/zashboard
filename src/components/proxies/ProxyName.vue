<template>
  <div class="flex shrink-0 items-center gap-1">
    <ProxyIcon
      v-if="icon"
      :icon="icon"
      :size="size === 'large' ? 'large' : 'small'"
    />
    <span :class="size === 'large' ? 'text-lg font-medium' : 'text-sm'">{{ name }}</span>
  </div>
</template>

<script setup lang="ts">
import { proxyMap } from '@/store/proxies'
import { computed } from 'vue'
import ProxyIcon from './ProxyIcon.vue'

const props = defineProps<{
  name: string
  size?: 'small' | 'large'
}>()

const icon = computed(() => {
  return proxyMap.value[props.name]?.icon
})
</script>
