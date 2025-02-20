import { PROXY_TAB_TYPE } from '@/constant'
import { configs } from '@/store/config'
import {
  GLOBAL,
  hiddenGroupMap,
  proxyGroupList,
  proxyMap,
  proxyProviederList,
} from '@/store/proxies'
import { displayGlobalInNonGlobalMode, manageHiddenGroup } from '@/store/settings'
import { isEmpty } from 'lodash'
import { computed, ref } from 'vue'

export const proxiesFilter = ref('')

const proxiesTabShow = ref(PROXY_TAB_TYPE.PROXIES)
const renderGroups = computed(() => {
  if (isEmpty(proxyMap.value)) {
    return []
  }

  if (proxiesTabShow.value === PROXY_TAB_TYPE.PROVIDER) {
    return proxyProviederList.value.map((group) => group.name)
  }

  if (configs.value?.mode.toUpperCase() === GLOBAL) {
    return [GLOBAL]
  }

  let proxyGroups = [...proxyGroupList.value]

  if (!manageHiddenGroup.value) {
    proxyGroups = proxyGroups.filter((name) => !hiddenGroupMap.value[name])
  }

  if (displayGlobalInNonGlobalMode.value) {
    proxyGroups.push(GLOBAL)
  }

  return proxyGroups
})

export const useProxies = () => {
  return {
    proxiesTabShow,
    renderGroups,
  }
}
