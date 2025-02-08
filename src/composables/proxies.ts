import { isSingBox } from '@/api'
import { PROXY_TAB_TYPE } from '@/config'
import { configs } from '@/store/config'
import { GLOBAL, hiddenGroupMap, proxyGroupList, proxyProviederList } from '@/store/proxies'
import { manageHiddenGroup, twoColumnProxyGroup } from '@/store/settings'
import { computed, ref } from 'vue'

export const proxiesFilter = ref('')

const proxiesTabShow = ref(PROXY_TAB_TYPE.PROXIES)
const renderGroups = computed(() => {
  if (proxiesTabShow.value === PROXY_TAB_TYPE.PROVIDER) {
    return proxyProviederList.value.map((group) => group.name)
  }

  if (!isSingBox.value && configs.value?.mode.toUpperCase() === GLOBAL) {
    return [GLOBAL]
  }

  const proxyGroups = [...proxyGroupList.value]

  if (isSingBox.value) {
    proxyGroups.push(GLOBAL)
  }

  return manageHiddenGroup.value
    ? proxyGroups
    : proxyGroups.filter((name) => !hiddenGroupMap.value[name])
})
const hasTwoColumns = computed(() => twoColumnProxyGroup.value && renderGroups.value.length > 1)

export const useProxies = () => {
  return {
    proxiesTabShow,
    renderGroups,
    hasTwoColumns,
  }
}
