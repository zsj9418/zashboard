<template>
  <div class="relative flex h-28 flex-col gap-1 rounded-lg bg-base-200/40 p-2">
    <div>
      <span
        class="tooltip tooltip-bottom inline-block w-24 text-left"
        data-tip="api-v3.speedtest.cn"
        >{{ $t('chinaIP') }}</span
      >
      : {{ mainlangChinaIP }}
    </div>
    <div>
      <span
        class="tooltip tooltip-bottom inline-block w-24 text-left"
        data-tip="api.ip.sb"
        >{{ $t('globalIP') }}</span
      >
      : {{ globalIP }}
    </div>
    <div class="absolute bottom-2 left-2 flex items-center gap-1 text-xs">
      {{ $t('autoCheckWhenStart') }}:
      <input
        class="toggle toggle-xs"
        type="checkbox"
        v-model="autoIPCheck"
      />
    </div>
    <button
      class="btn btn-circle btn-sm absolute bottom-2 right-2"
      @click="getIPs"
    >
      <BoltIcon class="h-4 w-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { getIPForGlobalAPI, getIPForMainlandChinaAPI } from '@/api'
import { globalIP, mainlangChinaIP } from '@/composables/overview'
import { BoltIcon } from '@heroicons/vue/24/outline'
import { useStorage } from '@vueuse/core'
import { onMounted } from 'vue'

const autoIPCheck = useStorage('config/auto-ip-check', true)
const getIPs = () => {
  getIPForMainlandChinaAPI()
    .then((res) => res.json())
    .then(
      (res: {
        code: number
        data: {
          ip: string
          country: string
          province: string
          city: string
          district: string
          isp: string
          operator: string
          countryCode: string
          lon: string
          lat: string
        }
        msg: string
      }) => {
        mainlangChinaIP.value = `${res.data.operator} (${res.data.country})  ${res.data.ip}`
      },
    )
  getIPForGlobalAPI()
    .then((res) => res.json())
    .then(
      (res: {
        organization: string
        longitude: number
        city: string
        timezone: string
        isp: string
        offset: number
        asn: number
        asn_organization: string
        country: string
        ip: string
        latitude: number
        postal_code: string
        continent_code: string
        country_code: string
      }) => {
        globalIP.value = `${res.asn_organization} (${res.country})  ${res.ip}`
      },
    )
}

onMounted(() => {
  if (autoIPCheck.value && [mainlangChinaIP, globalIP].some((item) => item.value === '')) {
    getIPs()
  }
})
</script>
