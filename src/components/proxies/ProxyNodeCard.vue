<template>
  <div
    ref="cardRef"
    :class="
      twMerge(
        'flex min-h-9 cursor-pointer flex-wrap items-center justify-end gap-1 rounded-md bg-base-200 p-2 shadow',
        active ? 'bg-primary text-primary-content' : 'sm:hover:bg-base-300',
      )
    "
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
      <div
        :class="
          twMerge(
            'flex items-center text-xs sm:gap-2',
            twoColumnNodeForMobile ? 'gap-[2px]' : 'gap-1',
          )
        "
      >
        <div class="flex-1">
          <span>{{ typeFormatter(node.type) }}</span>
          <template v-if="node.udp">
            <span :class="twMerge('hidden sm:hidden', twoColumnNodeForMobile && 'inline')"
              >:udp</span
            >
            <span :class="twMerge('hidden sm:inline', !twoColumnNodeForMobile && 'inline')">
              | udp
            </span>
          </template>
        </div>
        <LatencyTag
          :class="isLatencyTesting ? 'animate-pulse' : ''"
          :name="node.name"
          @click.stop="handlerLatencyTest"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { proxyLatencyTest, proxyMap } from '@/store/proxies'
import { truncateProxyName, twoColumnNodeForMobile } from '@/store/settings'
import { twMerge } from 'tailwind-merge'
import tippy, { type Instance as TippyInstance } from 'tippy.js'
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
let intersectionObserver: IntersectionObserver | null = null
let resizeObserver: ResizeObserver | null = null
let tippyInstance: TippyInstance | null = null
const checkTruncation = () => {
  if (nameRef.value && cardRef.value) {
    const { scrollWidth, clientWidth } = nameRef.value

    if (scrollWidth > clientWidth) {
      if (!tippyInstance) {
        tippyInstance = tippy(cardRef.value, {
          content: props.name,
          placement: 'top',
          delay: [600, 0],
          appendTo: 'parent',
          animation: 'scale',
        })
      }
      tippyInstance?.enable()
    } else {
      tippyInstance?.disable()
    }
  }
}

const observeResize = () => {
  if (nameRef.value) {
    resizeObserver?.observe(nameRef.value)
    checkTruncation()
  }
}

const unobserveResize = () => {
  if (resizeObserver && nameRef.value) {
    resizeObserver.unobserve(nameRef.value)
  }
}

onMounted(() => {
  if (cardRef.value) {
    if (truncateProxyName.value) {
      resizeObserver = new ResizeObserver(() => {
        checkTruncation()
      })
    }
    intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        showContent.value = entry.isIntersecting
        if (truncateProxyName.value) {
          if (showContent.value) {
            nextTick(observeResize)
          } else {
            unobserveResize()
          }
        }
      })
    })
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

  tippyInstance?.destroy()
  tippyInstance = null
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
