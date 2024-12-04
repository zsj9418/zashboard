import { isSingBox } from '@/api'
import { PROXY_TAB_TYPE } from '@/config'
import { configs } from '@/store/config'
import { GLOBAL, proxyGroupList, proxyMap, proxyProviederList } from '@/store/proxies'
import { showGlobalProxy, twoColumns } from '@/store/settings'
import { computed, ref } from 'vue'

const proxiesTabShow = ref(PROXY_TAB_TYPE.PROXIES)
const renderGroups = computed(() => {
  if (proxiesTabShow.value === PROXY_TAB_TYPE.PROVIDER) {
    return proxyProviederList.value.map((group) => group.name)
  }

  if (isSingBox.value && (showGlobalProxy.value || !proxyGroupList.value.length)) {
    return [...proxyGroupList.value, GLOBAL]
  }

  if (
    !isSingBox.value &&
    configs.value?.mode.toLocaleUpperCase() === GLOBAL &&
    proxyMap.value[GLOBAL]
  ) {
    return [GLOBAL]
  }
  return proxyGroupList.value
})
const hasTwoColumns = computed(() => twoColumns.value && renderGroups.value.length > 1)

export const useProxies = () => {
  return {
    proxiesTabShow,
    renderGroups,
    hasTwoColumns,
  }
}
