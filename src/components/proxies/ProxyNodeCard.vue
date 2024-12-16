<template>
  <div
    ref="cardRef"
    :class="
      twMerge(
        'flex min-h-9 cursor-pointer flex-wrap items-center justify-end gap-1 rounded-md bg-base-200 p-2 text-xs sm:gap-2',
        active ? 'bg-primary text-primary-content' : 'sm:hover:bg-base-300',
        isTruncated && 'tooltip tooltip-bottom',
      )
    "
    :data-tip="node.name"
  >
    <template v-if="showContent">
      <ProxyIcon
        v-if="node.icon"
        :icon="node.icon"
        :fill="active ? 'fill-primary-content' : 'fill-base-content'"
      />
      <div
        :class="
          twMerge('flex-1 whitespace-nowrap text-xs md:text-sm', truncateProxyName && 'truncate')
        "
        ref="nameRef"
      >
        {{ node.name }}
      </div>
      <span>{{ typeDescription }}</span>
      <LatencyTag
        :class="isLatencyTesting ? 'animate-pulse' : ''"
        :name="node.name"
        @click.stop="handlerLatencyTest"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { isSmallScreen } from '@/helper'
import { proxyLatencyTest, proxyMap } from '@/store/proxies'
import { truncateProxyName, twoColumnNodeForMobile } from '@/store/settings'
import { debounce } from 'lodash'
import { twMerge } from 'tailwind-merge'
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import LatencyTag from './LatencyTag.vue'
import ProxyIcon from './ProxyIcon.vue'

const props = defineProps<{
  name: string
  active?: boolean
}>()
const nameRef = ref()
const showContent = ref(false)
const cardRef = ref<HTMLDivElement | null>(null)
const isTruncated = ref(false)
let intersectionObserver: IntersectionObserver | null = null
let resizeObserver: ResizeObserver | null = null
const checkTruncation = debounce(() => {
  if (nameRef.value && cardRef.value) {
    const { scrollWidth, clientWidth } = nameRef.value

    isTruncated.value = scrollWidth > clientWidth
  }
}, 1000)

const observeResize = () => {
  if (nameRef.value) {
    resizeObserver?.observe(nameRef.value)
    checkTruncation()
  }
}

onMounted(() => {
  if (cardRef.value) {
    if (truncateProxyName.value) {
      resizeObserver = new ResizeObserver(() => {
        checkTruncation()
      })
    }
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            showContent.value = true
            nextTick(() => {
              if (cardRef.value) {
                intersectionObserver?.unobserve(cardRef.value)
              }
              intersectionObserver?.disconnect()
              intersectionObserver = null
              observeResize()
            })
          }
        })
      },
      {
        rootMargin: '200px 0px 200px 0px',
      },
    )
    intersectionObserver.observe(cardRef.value)
  }
})

onUnmounted(() => {
  if (resizeObserver && cardRef.value) {
    resizeObserver.unobserve(cardRef.value)
  }
  resizeObserver?.disconnect()
  resizeObserver = null

  if (intersectionObserver && cardRef.value) {
    intersectionObserver.unobserve(cardRef.value)
  }
  intersectionObserver?.disconnect()
  intersectionObserver = null
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
const typeDescription = computed(() => {
  const type = typeFormatter(node.value.type)

  if (node.value.udp) {
    if (isSmallScreen.value && twoColumnNodeForMobile.value) {
      return `${type}:udp`
    }
    return `${type} | udp`
  }

  return type
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
