<template>
  <div class="collapse collapse-arrow bg-base-100 shadow-md">
    <div class="collapse-title">
      <div class="flex items-center gap-2">
        <div class="text-lg font-medium sm:text-xl">
          {{ proxyProvider.name }}
        </div>
        <div class="flex-1" />
        <div class="flex gap-2">
          <button
            :class="twMerge('btn btn-circle btn-xs z-30', isHealthChecking ? 'animate-pulse' : '')"
            @click="healthCheckClickHandler"
          >
            <BoltIcon class="h-4 w-4" />
          </button>
          <button
            :class="twMerge('btn btn-circle btn-xs z-30', isHealthChecking ? 'animate-pulse' : '')"
            @click="updateProviderClickHandler"
          >
            <ArrowPathIcon class="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        class="flex flex-wrap gap-1 pt-2"
        v-if="!showCollapse"
      >
        <div
          v-for="node in proxyProvider.proxies"
          :key="node"
          class="flex h-4 w-4 items-center justify-center rounded-full shadow-sm"
          :class="getBgColor(getLatencyByName(node))"
        ></div>
      </div>
    </div>
    <input
      type="checkbox"
      v-model="showCollapse"
    />
    <div class="collapse-content flex flex-col gap-2">
      <div
        :class="
          twMerge(
            'grid grid-cols-1 gap-2 sm:grid-cols-2 3xl:grid-cols-3',
            !twoColumns && 'lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5',
          )
        "
        v-if="showContent"
      >
        <ProxyNodeCard
          v-for="node in proxyProvider.proxies"
          :key="node.name"
          :name="node.name"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { proxyProviderHealthCheckAPI, updateProxyProviderAPI } from '@/api'
import { collapseGroupMap, twoColumns } from '@/store/config'
import { fetchProxies, getLatencyByName, proxyProviederList } from '@/store/proxies'
import { ArrowPathIcon, BoltIcon } from '@heroicons/vue/24/outline'
import { twMerge } from 'tailwind-merge'
import { computed, ref, watch } from 'vue'
import ProxyNodeCard from './ProxyNodeCard.vue'
const props = defineProps<{
  name: string
}>()
const getBgColor = (latency: number) => {
  if (latency === 0) {
    return 'bg-gray-500'
  } else if (latency < 300) {
    return 'bg-green-500'
  } else if (latency < 800) {
    return 'bg-yellow-500'
  } else {
    return 'bg-red-500'
  }
}
const showCollapse = computed({
  get() {
    return collapseGroupMap.value[props.name]
  },
  set(value) {
    collapseGroupMap.value[props.name] = value
  },
})
const showContent = ref(showCollapse.value)

watch(showCollapse, (value) => {
  if (value) {
    showContent.value = value
  } else {
    setTimeout(() => {
      if (value === showCollapse.value) {
        showContent.value = value
      }
    }, 1000)
  }
})

const proxyProvider = computed(
  () => proxyProviederList.value.find((group) => group.name === props.name)!,
)
const isUpdating = ref(false)
const isHealthChecking = ref(false)

const healthCheckClickHandler = async () => {
  if (isHealthChecking.value) return

  isHealthChecking.value = true
  await proxyProviderHealthCheckAPI(props.name)
  await fetchProxies()
  isHealthChecking.value = false
}

const updateProviderClickHandler = async () => {
  if (isUpdating.value) return

  isUpdating.value = true
  await updateProxyProviderAPI(props.name)
  await fetchProxies()
  isUpdating.value = false
}
</script>
