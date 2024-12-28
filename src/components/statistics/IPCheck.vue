<template>
  <div class="flex flex-col gap-2 rounded-lg bg-base-200/40 p-4">
    <div>
      {{ $t('ipCheck') }}
    </div>
    <div>{{ $t('ipForMainlandChina') }}: {{ mainlangChinaIP }}</div>
    <div>{{ $t('ipForGlobal') }}: {{ globalIP }}</div>
  </div>
</template>

<script setup lang="ts">
import { getIPForGlobalAPI, getIPForMainlandChinaAPI } from '@/api'
import { onMounted, ref } from 'vue'

const mainlangChinaIP = ref()
const globalIP = ref()

onMounted(() => {
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
        mainlangChinaIP.value = `${res.data.ip} | ${res.data.operator} (${res.data.country})`
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
        console.log(res)
        globalIP.value = `${res.ip} | ${res.asn_organization} (${res.country})`
      },
    )
})
</script>
