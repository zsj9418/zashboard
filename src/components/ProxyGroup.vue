<template>
  <div class="collapse collapse-arrow bg-base-200">
    <div class="collapse-title flex items-center gap-2">
      <div class="text-xl font-medium">
        {{ proxyGroup.name }}
      </div>
      <div class="text-sm">
        {{ proxyGroup.now }}
      </div>
      <LatencyTag :class="twMerge('z-10', isLatencyTesting ? 'animate-pulse' : '')" :name="proxyGroup.now" @click.stop="handlerLatencyTest"/>
    </div>
    <input type="checkbox" checked/>
    <div class="collapse-content flex flex-col gap-2">
      <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
        <ProxyNodeCard v-for="node in proxyGroup.all" :key="node" :name="node" :active="node === proxyGroup.now"
        @click="selectProxy(proxyGroup.name, node)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LatencyTag from '@/components/LatencyTag.vue';
import ProxyNodeCard from '@/components/ProxyNodeCard.vue';
import { selectProxy, proxyMap, proxyGroupLatencyTest } from '@/store/proxies';
import { twMerge } from 'tailwind-merge';
import { computed, ref } from 'vue';
const props = defineProps<{
  name: string
}>()
const proxyGroup = computed(() => proxyMap.value[props.name])
const isLatencyTesting = ref(false)
const handlerLatencyTest = async () => {
  if (isLatencyTesting.value) return

  isLatencyTesting.value = true
  await proxyGroupLatencyTest(props.name)
  isLatencyTesting.value = false
}
</script>