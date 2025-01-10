<template>
  <div class="relative flex h-28 flex-col gap-1 rounded-lg bg-base-200/40 p-2">
    <div>
      <span
        class="tooltip tooltip-bottom inline-block w-24 text-left"
        data-tip="api-v3.speedtest.cn"
        >{{ $t('chinaIP') }}</span
      >
      : {{ mainlandChinaIP }}
    </div>
    <div>
      <span
        class="tooltip tooltip-bottom inline-block w-24 text-left"
        data-tip="api.ip.sb"
        >{{ $t('globalIP') }}</span
      >
      : {{ globalIP }}
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
import { globalIP, mainlandChinaIP } from '@/composables/overview'
import { autoIPCheck } from '@/store/settings'
import { BoltIcon } from '@heroicons/vue/24/outline'
import { onMounted } from 'vue'

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
        mainlandChinaIP.value = `${res.data.operator} (${res.data.country})  ${res.data.ip}`
      },
    )
  getIPForGlobalAPI().then((res) => {
    globalIP.value = `${res.asn_organization} (${res.country})  ${res.ip}`
  })
}

onMounted(() => {
  if (autoIPCheck.value && [mainlandChinaIP, globalIP].some((item) => item.value === '')) {
    getIPs()
  }
})
</script>
