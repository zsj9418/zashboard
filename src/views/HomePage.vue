<template>
  <div class="w-128 drawer md:drawer-open">
    <input
      id="sidebar"
      type="checkbox"
      class="drawer-toggle"
    />

    <SideBar />

    <div
      class="drawer-content fixed bottom-0 flex h-full w-full flex-col overflow-hidden bg-base-200/40 md:relative md:w-auto"
    >
      <component
        v-if="ctrlComp && isSiderbarCollapsed"
        :is="ctrlComp"
        :horizontal="true"
      />
      <div class="relative h-0 flex-1">
        <RouterView class="absolute h-full w-full" />
      </div>
      <div :class="`${isPWA ? 'pb-24' : 'pb-12'} md:hidden`"></div>
      <div
        ref="navBarRef"
        :class="`fixed bottom-0 z-30 w-full bg-base-200 md:hidden ${isPWA ? 'h-24 pb-12' : 'h-12'}`"
      >
        <div class="flex h-12 w-full items-center justify-center gap-1 p-2">
          <ul class="menu menu-horizontal flex flex-1">
            <li
              v-for="r in routes"
              :key="r"
              class="flex-1"
            >
              <a
                class="flex items-center justify-center"
                :class="r === route.name ? 'active' : 'inactive'"
                :href="`#${r}`"
              >
                <component
                  :is="ROUTE_ICON_MAP[r]"
                  class="h-5 w-5"
                />
              </a>
            </li>
          </ul>
          <label for="sidebar">
            <div class="btn btn-circle drawer-button btn-sm bg-neutral text-neutral-content">
              <Bars3Icon class="h-4 w-4" />
            </div>
          </label>
        </div>
      </div>
    </div>

    <dialog
      id="autoSwitchBackend"
      ref="modalRef"
      class="modal"
    >
      <div class="modal-box">
        <h3 class="text-lg font-bold">{{ $t('currentBackendUnavailable') }}</h3>
        <div class="flex justify-end gap-2">
          <button
            class="btn btn-sm"
            @click="closeModal"
          >
            {{ $t('cancel') }}
          </button>
          <button
            class="btn btn-primary btn-sm"
            @click="autoSwitchBackend"
          >
            {{ $t('confirm') }}
          </button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { isBackendAvailable } from '@/api'
import ConnectionCtrl from '@/components/sidebar/ConnectionCtrl.vue'
import LogsCtrl from '@/components/sidebar/LogsCtrl.vue'
import ProxiesCtrl from '@/components/sidebar/ProxiesCtrl.vue'
import RulesCtrl from '@/components/sidebar/RulesCtrl.vue'
import SideBar from '@/components/sidebar/SideBar.vue'
import { useProxies } from '@/composables/proxies'
import { rulesTabShow } from '@/composables/rules'
import { useSettings } from '@/composables/settings'
import { useTip } from '@/composables/tip'
import { PROXY_TAB_TYPE, ROUTE_ICON_MAP, ROUTE_NAME, RULE_TAB_TYPE } from '@/config'
import { getUrlFromBackend } from '@/helper'
import { fetchConfigs } from '@/store/config'
import { initConnections } from '@/store/connections'
import { initLogs } from '@/store/logs'
import { initSatistic } from '@/store/overview'
import { fetchProxies } from '@/store/proxies'
import { fetchRules } from '@/store/rules'
import { isSiderbarCollapsed } from '@/store/settings'
import { activeBackend, activeUuid, backendList } from '@/store/setup'
import { Bars3Icon } from '@heroicons/vue/24/outline'
import { useDocumentVisibility, useSwipe } from '@vueuse/core'
import { computed, ref, watch, type Component } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

const modalRef = ref<HTMLDialogElement | null>(null)
const isPWA = (() => {
  return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone
})()

const ctrlsMap: Record<string, Component> = {
  [ROUTE_NAME.connections]: ConnectionCtrl,
  [ROUTE_NAME.logs]: LogsCtrl,
  [ROUTE_NAME.proxies]: ProxiesCtrl,
  [ROUTE_NAME.rules]: RulesCtrl,
}

const router = useRouter()
const route = useRoute()
const routes = Object.values(ROUTE_NAME).filter((r) => r !== ROUTE_NAME.setup)
const ctrlComp = computed(() => {
  return ctrlsMap[route.name as keyof typeof ctrlsMap]
})

const navBarRef = ref()
const { direction } = useSwipe(navBarRef, { threshold: 15 })

const getNextRouteName = () => {
  const routeName = route.name as ROUTE_NAME

  if (routeName === ROUTE_NAME.setup) {
    return ROUTE_NAME.proxies
  }

  return routes[(routes.indexOf(routeName) + 1) % routes.length]
}
const getPrevRouteName = () => {
  const routeName = route.name as ROUTE_NAME

  if (routeName === ROUTE_NAME.setup) {
    return ROUTE_NAME.proxies
  }

  return routes[(routes.indexOf(routeName) - 1 + routes.length) % routes.length]
}

watch(direction, () => {
  if (direction.value === 'right') {
    router.push({ name: getPrevRouteName() })
  } else if (direction.value === 'left') {
    router.push({ name: getNextRouteName() })
  }
})

const { proxiesTabShow } = useProxies()
const { checkUIUpdate } = useSettings()
watch(
  activeUuid,
  () => {
    if (!activeUuid.value) return
    rulesTabShow.value = RULE_TAB_TYPE.RULES
    proxiesTabShow.value = PROXY_TAB_TYPE.PROXIES
    fetchConfigs()
    fetchProxies()
    fetchRules()
    initConnections()
    initLogs()
    initSatistic()
    checkUIUpdate()
  },
  {
    immediate: true,
  },
)

const closeModal = () => {
  modalRef.value?.close()
}
const { showTip } = useTip()
const autoSwitchBackend = async () => {
  const otherEnds = backendList.value.filter((end) => end.uuid !== activeUuid.value)

  closeModal()
  const avaliable = (
    await Promise.all(
      otherEnds.map(async (end) => {
        return (await isBackendAvailable(end)) ? end : null
      }),
    )
  ).filter((end) => end !== null)

  if (avaliable.length > 0) {
    activeUuid.value = avaliable[0].uuid
    showTip('backendSwitchTo', {
      backend: getUrlFromBackend(avaliable[0]),
    })
  }
}

const documentVisible = useDocumentVisibility()

watch(
  documentVisible,
  async () => {
    if (
      !activeBackend.value ||
      backendList.value.length === 0 ||
      documentVisible.value !== 'visible'
    ) {
      return
    }
    try {
      const isAvailable = await isBackendAvailable(activeBackend.value)

      if (!isAvailable) {
        modalRef.value?.showModal()
      }
    } catch {
      modalRef.value?.showModal()
    }
  },
  {
    immediate: true,
  },
)
</script>
