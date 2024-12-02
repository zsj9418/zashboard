<template>
  <div
    :class="
      twMerge(
        'flex cursor-pointer flex-wrap items-center justify-end gap-1 rounded-md bg-base-200 p-2 shadow-md',
        props.active && 'bg-primary text-primary-content',
        truncateProxyName && isTruncate && 'tooltip text-left',
      )
    "
    :data-tip="node.name"
  >
    <div
      :class="
        twMerge('flex-1 whitespace-nowrap text-xs md:text-sm', truncateProxyName && 'truncate')
      "
      ref="nameRef"
    >
      {{ node.name }}
    </div>
    <div class="flex items-center gap-2 text-xs">
      <div class="flex-1">
        <span>{{ typeFormatter(node.type) }}</span>
        <span v-if="node.udp"> | udp</span>
      </div>
      <LatencyTag
        :class="isLatencyTesting ? 'animate-pulse' : ''"
        :name="node.name"
        @click.stop="handlerLatencyTest"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { proxyLatencyTest, proxyMap } from '@/store/proxies'
import { truncateProxyName } from '@/store/settings'
import { useElementSize } from '@vueuse/core'
import { twMerge } from 'tailwind-merge'
import { computed, ref } from 'vue'
import LatencyTag from './LatencyTag.vue'

const props = defineProps<{
  name: string
  active?: boolean
}>()
const nameRef = ref()
const isTruncate = computed(() => {
  const { width } = useElementSize(nameRef)

  return width.value < nameRef.value?.scrollWidth
})

const node = computed(() => proxyMap.value[props.name])
const isLatencyTesting = ref(false)
const typeFormatter = (type: string) => {
  type = type.toLowerCase()
  type = type.replace('shadowsocks', 'ss')
  type = type.replace('hysteria', 'hy')
  type = type.replace('wireguard', 'wg')

  return type
}
const handlerLatencyTest = async () => {
  if (isLatencyTesting.value) return

  isLatencyTesting.value = true
  try {
    await proxyLatencyTest(props.name)
    isLatencyTesting.value = false
  } catch {
    isLatencyTesting.value = false
  }
}
</script>

<style scoped>
.tooltip:before {
  z-index: 20;
}
</style>
