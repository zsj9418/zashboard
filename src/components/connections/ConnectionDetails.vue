<template>
  <DialogWrapper v-model="connectionDetailModalShow">
    <VueJsonPretty :data="infoConn" />
    <div
      class="mt-2 min-h-10 text-sm"
      v-if="destinationIP && !isPrivateIP"
    >
      <template v-if="details">
        {{ $t('connectionIP') }} {{ details?.ip }} ( AS{{ details?.asn }} )
        <div class="flex gap-3">
          {{ details?.country }}
          {{ details?.asn_organization }}
        </div>
      </template>
    </div>
  </DialogWrapper>
</template>

<script setup lang="ts">
import { getIPFromIpsbAPI, type GlobalIPType } from '@/api'
import DialogWrapper from '@/components/common/DialogWrapper.vue'
import { useConnections } from '@/composables/connections'
import { computed, ref, watch } from 'vue'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

const { infoConn, connectionDetailModalShow } = useConnections()
const details = ref<GlobalIPType | null>(null)

const localIPv4Reg = /^(127\.|10\.|192\.18\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/
const localIPv6Reg = /^(fc00::|fd[0-9a-f]{2}:|fe80::)/

const destinationIP = computed(() => infoConn.value?.metadata.destinationIP)
const isPrivateIP = computed(() => {
  if (!destinationIP.value) {
    return false
  }

  return localIPv4Reg.test(destinationIP.value) || localIPv6Reg.test(destinationIP.value)
})

watch(
  () => destinationIP.value,
  (newIP) => {
    if (!newIP) {
      return
    }

    if (isPrivateIP.value) {
      details.value = null
      return
    }

    if (details.value?.ip === newIP) {
      return
    }

    details.value = null
    getIPFromIpsbAPI(infoConn.value?.metadata.destinationIP).then((res) => {
      details.value = res
    })
  },
)
</script>
