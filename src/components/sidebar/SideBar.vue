<template>
  <div class="drawer-side z-30">
    <label
      for="sidebar"
      aria-label="close sidebar"
      class="drawer-overlay"
    ></label>
    <div
      :class="
        twMerge(
          'flex h-full flex-col gap-2 overflow-x-hidden bg-base-200 p-2 text-base-content !transition-all duration-500',
          isSiderbarCollapsed ? 'w-18 px-0' : 'w-[21rem]',
        )
      "
    >
      <ul class="menu flex-1 pb-0">
        <li
          v-for="r in routes"
          :key="r"
        >
          <a
            :class="r === route.name ? 'active' : 'inactive'"
            @click="() => router.push({ name: r })"
          >
            <component
              :is="ROUTE_ICON_MAP[r]"
              class="h-5 w-5"
            />
            <template v-if="!isSiderbarCollapsed">
              {{ $t(r) }}
            </template>
          </a>
        </li>
      </ul>
      <template v-if="isSiderbarCollapsed">
        <VerticalInfos />
      </template>
      <template v-else>
        <div class="card">
          <component
            v-if="sidebarComp"
            :is="sidebarComp"
          />
          <CommonSidebar />
        </div>
        <div
          class="card overflow-hidden"
          v-if="route.name !== ROUTE_NAME.settings"
        >
          <SpeedCharts />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import CommonSidebar from '@/components/sidebar/CommonCtrl.vue'
import ConnectionCtrl from '@/components/sidebar/ConnectionCtrl.vue'
import LogsCtrl from '@/components/sidebar/LogsCtrl.vue'
import ProxiesCtrl from '@/components/sidebar/ProxiesCtrl.vue'
import RulesCtrl from '@/components/sidebar/RulesCtrl.vue'
import SpeedCharts from '@/components/statistics/SpeedCharts.vue'
import { ROUTE_ICON_MAP, ROUTE_NAME } from '@/config'
import router from '@/router'
import { isSiderbarCollapsed } from '@/store/settings'
import { twMerge } from 'tailwind-merge'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import VerticalInfos from './VerticalInfos.vue'

const sidebarCompMap = {
  [ROUTE_NAME.connections]: ConnectionCtrl,
  [ROUTE_NAME.logs]: LogsCtrl,
  [ROUTE_NAME.proxies]: ProxiesCtrl,
  [ROUTE_NAME.rules]: RulesCtrl,
}

const sidebarComp = computed(() => {
  if (route.name) {
    return sidebarCompMap[route.name as keyof typeof sidebarCompMap]
  }

  return null
})

const route = useRoute()
const routes = Object.values(ROUTE_NAME)
</script>
