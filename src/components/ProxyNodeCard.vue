<template>
  <div :class="twMerge(
    'flex rounded-md bg-base-100 p-2 shadow-xl items-center gap-2 cursor-pointer',
    props.active && 'bg-primary text-primary-content'
  )">
    <div class="flex-1 text-xs md:text-sm">{{ node.name }}</div>
    <div class="flex gap-2 items-center text-xs">
      <div class="flex-1">
        <span>{{ node.type }}</span>
        <span> :: {{ node.udp ? 'udp' : '' }}</span>
      </div>
      <LatencyTag :class="isLatencyTesting ? 'animate-pulse' : ''" :name="node.name" @click.stop="handlerLatencyTest"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { proxyLatencyTest, proxyMap } from '@/store/proxies';
import { twMerge } from 'tailwind-merge';
import LatencyTag from './LatencyTag.vue';
import { ref } from 'vue';

const props = defineProps<{
  name: string
  active: boolean
}>()
const node = proxyMap.value[props.name]
const isLatencyTesting = ref(false)

const handlerLatencyTest = async () => {
  if (isLatencyTesting.value) return

  isLatencyTesting.value = true
  await proxyLatencyTest(node.name)
  isLatencyTesting.value = false
}

</script>
