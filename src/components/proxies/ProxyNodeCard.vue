<template>
  <div
    ref="cardRef"
    :class="
      twMerge(
        'flex cursor-pointer flex-col items-start gap-[2px] rounded-md bg-base-200',
        active ? 'bg-primary text-primary-content' : 'sm:hover:bg-base-300',
        isTruncated && 'tooltip tooltip-bottom',
        isSmallCard ? 'p-1' : 'p-2',
      )
    "
    :data-tip="node.name"
    @mouseenter="checkTruncation"
  >
    <div class="flex w-full flex-1 items-center gap-1">
      <ProxyIcon
        v-if="node.icon"
        class="shrink-0"
        size="small"
        :icon="node.icon"
        :fill="active ? 'fill-primary-content' : 'fill-base-content'"
      />
      <span
        :class="twMerge('text-sm', truncateProxyName && 'truncate')"
        ref="nameRef"
      >
        {{ node.name }}
      </span>
    </div>

    <div class="flex h-4 w-full items-center justify-between">
      <span
        :class="`whitespace-nowrap text-xs tracking-tight ${active ? 'text-primary-content' : 'text-slate-500'}`"
      >
        {{ typeDescription }}
      </span>
      <LatencyTag
        :class="[isLatencyTesting ? 'animate-pulse cursor-wait' : '', isSmallCard && '!h-4 !w-8']"
        :name="node.name"
        @click.stop="handlerLatencyTest"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PROXY_CARD_SIZE } from '@/config'
import { getIPv6ByName, proxyLatencyTest, proxyMap } from '@/store/proxies'
import { IPv6test, proxyCardSize, truncateProxyName } from '@/store/settings'
import { twMerge } from 'tailwind-merge'
import { computed, ref } from 'vue'
import LatencyTag from './LatencyTag.vue'
import ProxyIcon from './ProxyIcon.vue'

const props = defineProps<{
  name: string
  active?: boolean
}>()

const nameRef = ref<HTMLDivElement | null>(null)
const isTruncated = ref(false)
const checkTruncation = () => {
  if (nameRef.value) {
    const { scrollWidth, clientWidth } = nameRef.value

    isTruncated.value = scrollWidth > clientWidth
  }
}

const node = computed(() => proxyMap.value[props.name])
const isLatencyTesting = ref(false)
const typeFormatter = (type: string) => {
  type = type.toLowerCase()
  type = type.replace('shadowsocks', 'ss')
  type = type.replace('hysteria', 'hy')
  type = type.replace('wireguard', 'wg')

  return type
}
const isSmallCard = computed(() => proxyCardSize.value === PROXY_CARD_SIZE.SMALL)
const typeDescription = computed(() => {
  const type = typeFormatter(node.value.type)
  const isV6 = IPv6test.value && getIPv6ByName(node.value.name) ? 'IPv6' : ''
  const isUDP = node.value.udp ? 'udp' : ''

  return [type, isUDP, isV6].filter(Boolean).join(isSmallCard.value ? '/' : ' / ')
})
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
