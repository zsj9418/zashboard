<template>
  <div
    class="relative h-20"
    ref="cardRef"
    @click="handlerGroupClick"
  >
    <div
      v-if="activeMode"
      class="fixed inset-0 z-40 transition-all duration-200"
      :class="modalMode && 'bg-black/50'"
    ></div>
    <div
      class="card overflow-hidden will-change-[height,width,transform]"
      :class="[
        activeMode ? `fixed z-50` : 'absolute left-0 top-0 h-auto w-full',
        modalMode && 'left-1/2 top-1/2 max-h-[70vh] w-[96vw] -translate-x-1/2 -translate-y-1/2',
        transitionAll && 'transition-all duration-200',
      ]"
      :style="[
        activeMode && {
          '--tw-bg-opacity': 1,
        },
        activeMode &&
          !modalMode && {
            left: initX + 'px',
            top: initY + 'px',
            width: initWidth + 'px',
            height: initHeight + 'px',
          },
      ]"
      @contextmenu.prevent.stop="handlerLatencyTest"
      @transitionend="handlerTransitionEnd"
    >
      <div class="flex h-20 shrink-0 flex-col gap-1 p-2">
        <ProxyIcon
          v-if="proxyGroup.icon"
          :icon="proxyGroup.icon"
          size="small"
          class="absolute right-2 top-2 z-[-1] h-10 !w-10"
        />
        <div class="text-md truncate">
          {{ proxyGroup.name }}
        </div>
        <div class="h-4 truncate text-xs text-base-content/80">
          {{ proxyGroup.now }}
        </div>

        <div class="flex h-4 justify-between gap-1">
          <span class="text-xs text-base-content/60">
            {{ proxyGroup.type }} ({{ proxiesCount }})
          </span>
          <button
            v-if="manageHiddenGroup"
            class="btn btn-circle btn-xs z-10 ml-1"
            @click.stop="handlerGroupToggle"
          >
            <EyeIcon
              v-if="!hiddenGroupMap[proxyGroup.name]"
              class="h-3 w-3"
            />
            <EyeSlashIcon
              v-else
              class="h-3 w-3"
            />
          </button>
          <LatencyTag
            :class="twMerge('z-10 bg-base-200/40 hover:shadow')"
            :loading="isLatencyTesting"
            :name="proxyGroup.now"
            :group-name="proxyGroup.name"
            @click.stop="handlerLatencyTest"
          />
        </div>
      </div>

      <div
        v-if="activeMode"
        class="grid flex-1 grid-cols-2 gap-2 overflow-y-auto overflow-x-hidden p-2"
      >
        <ProxyNodeCard
          v-for="node in renderProxies"
          :key="node"
          :name="node"
          :group-name="proxyGroup.name"
          :active="node === proxyGroup.now"
          @click.stop="handlerProxySelect(node)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRenderProxies } from '@/composables/renderProxies'
import { PROXY_TYPE } from '@/constant'
import { hiddenGroupMap, proxyGroupLatencyTest, proxyMap, selectProxy } from '@/store/proxies'
import { manageHiddenGroup } from '@/store/settings'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import { twMerge } from 'tailwind-merge'
import { computed, nextTick, ref } from 'vue'
import LatencyTag from './LatencyTag.vue'
import ProxyIcon from './ProxyIcon.vue'
import ProxyNodeCard from './ProxyNodeCard.vue'

const props = defineProps<{
  name: string
}>()
const proxyGroup = computed(() => proxyMap.value[props.name])
const allProxies = computed(() => proxyGroup.value.all ?? [])
const { proxiesCount, renderProxies } = useRenderProxies(allProxies, props.name)
const isLatencyTesting = ref(false)

const activeMode = ref(false)
const modalMode = ref(activeMode.value)
const cardRef = ref()

const initX = ref(0)
const initY = ref(0)
const initWidth = ref(0)
const initHeight = ref(0)
const transitionAll = ref(false)

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const transitionEndCallback = ref<() => void>(() => {})
const handlerTransitionEnd = () => {
  transitionEndCallback.value()
}

const handlerGroupClick = async () => {
  if (!activeMode.value) {
    const { x, y, width, height } = cardRef.value.getBoundingClientRect()

    initX.value = x
    initY.value = y
    initWidth.value = width
    initHeight.value = height
  }

  transitionEndCallback.value = () => {}

  if (activeMode.value) {
    transitionAll.value = true
    modalMode.value = false
    transitionEndCallback.value = async () => {
      transitionAll.value = false
      await nextTick()
      activeMode.value = false
    }
  } else {
    transitionAll.value = false
    activeMode.value = true
    await sleep(50)
    transitionAll.value = true
    modalMode.value = true
  }
}

const handlerLatencyTest = async () => {
  if (isLatencyTesting.value) return

  isLatencyTesting.value = true
  try {
    await proxyGroupLatencyTest(props.name)
    isLatencyTesting.value = false
  } catch {
    isLatencyTesting.value = false
  }
}
const handlerGroupToggle = () => {
  hiddenGroupMap.value[props.name] = !hiddenGroupMap.value[props.name]
}

const handlerProxySelect = (name: string) => {
  if (proxyGroup.value.type.toLowerCase() === PROXY_TYPE.LoadBalance) return

  selectProxy(props.name, name)
}
</script>
