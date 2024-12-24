<template>
  <CollapseCard :name="proxyProvider.name">
    <template v-slot:title>
      <div class="flex items-center gap-2">
        <div class="text-lg font-medium sm:text-xl">
          {{ proxyProvider.name }}
          <span class="text-sm"> ({{ proxyProvider.proxies.length }}) </span>
        </div>
        <div class="flex-1" />
        <div class="flex gap-2">
          <button
            :class="twMerge('btn btn-circle btn-sm z-30', isHealthChecking ? 'animate-pulse' : '')"
            @click.stop="healthCheckClickHandler"
          >
            <BoltIcon class="h-4 w-4" />
          </button>
          <button
            :class="twMerge('btn btn-circle btn-sm z-30', isUpdating ? 'animate-spin' : '')"
            @click.stop="updateProviderClickHandler"
          >
            <ArrowPathIcon class="h-4 w-4" />
          </button>
        </div>
      </div>
      <progress
        class="progress"
        v-if="subscriptionInfo"
        :value="subscriptionInfo.percentage"
        max="100"
      />
      <div class="flex flex-col sm:flex-row sm:gap-4">
        <template v-if="subscriptionInfo">
          <div class="text-sm text-slate-500">
            {{ subscriptionInfo.used }} / {{ subscriptionInfo.total }} (
            {{ subscriptionInfo.percentage }}% )
          </div>
          <div class="text-sm text-slate-500">
            {{ subscriptionInfo.expirePrefix() }}: {{ subscriptionInfo.expireStr() }}
          </div>
        </template>
        <div class="text-sm text-slate-500">
          {{ $t('updated') }} {{ fromNow(proxyProvider.updatedAt) }}
        </div>
      </div>
    </template>
    <template v-slot:preview>
      <ProxyPreview :nodes="sortedProxies" />
    </template>
    <template v-slot:content>
      <ProxyNodeGrid>
        <ProxyNodeCard
          v-for="node in sortedProxies"
          :key="node"
          :name="node"
        />
      </ProxyNodeGrid>
    </template>
  </CollapseCard>
</template>

<script setup lang="ts">
import { proxyProviderHealthCheckAPI, updateProxyProviderAPI } from '@/api'
import { fromNow, prettyBytesHelper, sortAndFilterProxyNodes } from '@/helper'
import { fetchProxies, proxyProviederList } from '@/store/proxies'
import type { SubscriptionInfo } from '@/types'
import { ArrowPathIcon, BoltIcon } from '@heroicons/vue/24/outline'
import dayjs from 'dayjs'
import { toFinite } from 'lodash'
import { twMerge } from 'tailwind-merge'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CollapseCard from '../common/CollapseCard.vue'
import ProxyNodeCard from './ProxyNodeCard.vue'
import ProxyNodeGrid from './ProxyNodeGrid.vue'
import ProxyPreview from './ProxyPreview.vue'

const props = defineProps<{
  name: string
}>()

const getSubscriptionsInfo = (subscriptionInfo: SubscriptionInfo) => {
  const { Download = 0, Upload = 0, Total = 0, Expire = 0 } = subscriptionInfo

  const total = prettyBytesHelper(Total, { binary: true })
  const used = prettyBytesHelper(Download + Upload, { binary: true })
  const percentage = toFinite((((Download + Upload) / Total) * 100).toFixed(2))

  const expirePrefix = () => {
    const { t } = useI18n()

    return t('expire')
  }

  const expireStr = () => {
    const { t } = useI18n()

    if (Expire === 0) {
      return t('noExpire')
    }

    return dayjs(Expire * 1000).format('YYYY-MM-DD')
  }

  return {
    total,
    used,
    percentage,
    expirePrefix,
    expireStr,
  }
}

const proxyProvider = computed(
  () => proxyProviederList.value.find((group) => group.name === props.name)!,
)
const sortedProxies = computed(() => {
  return sortAndFilterProxyNodes(proxyProvider.value.proxies.map((node) => node.name))
})
const subscriptionInfo = computed(() => {
  if (proxyProvider.value.subscriptionInfo) {
    return getSubscriptionsInfo(proxyProvider.value.subscriptionInfo)
  }

  return null
})

const isUpdating = ref(false)
const isHealthChecking = ref(false)

const healthCheckClickHandler = async () => {
  if (isHealthChecking.value) return

  isHealthChecking.value = true
  try {
    await proxyProviderHealthCheckAPI(props.name)
    await fetchProxies()
    isHealthChecking.value = false
  } catch {
    isHealthChecking.value = false
  }
}

const updateProviderClickHandler = async () => {
  if (isUpdating.value) return

  isUpdating.value = true
  try {
    await updateProxyProviderAPI(props.name)
    await fetchProxies()
    isUpdating.value = false
  } catch {
    isUpdating.value = false
  }
}
</script>
