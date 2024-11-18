<template>
  <div class="drawer md:drawer-open w-128">
    <input id="sidebar" type="checkbox" class="drawer-toggle" />

    <div class="drawer-side z-30">
      <label for="sidebar" aria-label="close sidebar" class="drawer-overlay"></label>
      <div class="flex flex-col bg-base-200 text-base-content h-full">
        <ul class="menu w-80 p-4 flex-1">
          <li v-for="r in routes" :key="r">
            <a :class="r === route.name ? 'active' : ''" :href="`#${r}`">{{ $t(r) }}</a>
          </li>
        </ul>
        <div class="card bg-base-100 shadow-lg m-2">
          <component v-if="sidebarComp" :is="sidebarComp" />
          <CommonSidebar />
        </div>
      </div>
    </div>

    <div class="drawer-content h-full overflow-hidden">
      <RouterView></RouterView>
      <label for="sidebar">
        <div class="btn btn-sm p-1 btn-circle btn-primary shadow-lg drawer-button md:hidden fixed bottom-6 right-6 z-20">
          =
        </div>
      </label>
    </div>

  </div>
</template>

<script setup lang="ts">
import { initConnections } from '@/store/connections';
import { initLogs } from '@/store/logs';
import { RouterView, useRoute } from 'vue-router'
import CommonSidebar from '@/components/sidebar/CommonCtrl.vue';
import { ROUTE_NAME } from '@/router';
import { computed, watch } from 'vue';
import LogsCtrl from '@/components/sidebar/LogsCtrl.vue';
import ConnectionCtrl from '@/components/sidebar/ConnectionCtrl.vue';
import ProxiesCtrl from '@/components/sidebar/ProxiesCtrl.vue';
import { activeUuid } from '@/store/setup';
import { fetchProxies } from '@/store/proxies';
import { fetchRules } from '@/store/rules';
import { fetchConfigs } from '@/store/config';

const sidebarCompMap = {
  [ROUTE_NAME.connections]: ConnectionCtrl,
  [ROUTE_NAME.logs]: LogsCtrl,
  [ROUTE_NAME.proxies]: ProxiesCtrl
}

const sidebarComp = computed(() => {

  if (route.name) {
    return sidebarCompMap[route.name as keyof typeof sidebarCompMap]
  }

  return null
})

const route = useRoute()
const routes = Object.values(ROUTE_NAME)

watch(activeUuid, () => {
  fetchConfigs()
  fetchProxies()
  fetchRules()
  initConnections()
  initLogs()
}, {
  immediate: true
})

</script>