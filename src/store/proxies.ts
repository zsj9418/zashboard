import {
  disconnectByIdAPI,
  fetchProxiesAPI,
  fetchProxyGroupLatencyAPI,
  fetchProxyLatencyAPI,
  fetchProxyProviderAPI,
  selectProxyAPI,
} from '@/api'
import { useNotification } from '@/composables/tip'
import { IPV6_TEST_URL, NOT_CONNECTED } from '@/config'
import { isProxyGroup } from '@/helper'
import { deleteIconFromIndexedDB, getAllIconKeys } from '@/helper/utils'
import type { Proxy, ProxyProvider } from '@/types'
import { useStorage } from '@vueuse/core'
import { compact, difference, last } from 'lodash'
import pLimit from 'p-limit'
import { computed, ref, watch } from 'vue'
import { activeConnections } from './connections'
import {
  automaticDisconnection,
  IPv6test,
  overrideUrlWithConfigIfExists,
  speedtestTimeout,
  speedtestUrl,
} from './settings'

export const GLOBAL = 'GLOBAL'
export const proxyGroupList = ref<string[]>([])
export const proxyMap = ref<Record<string, Proxy>>({})
export const latencyMap = ref<Record<string, number>>({})
export const IPv6Map = useStorage<Record<string, boolean>>('config/ipv6-map', {})
export const proxyProviederList = ref<ProxyProvider[]>([])

export const getLatencyByName = (proxyName: string) => {
  return latencyMap.value[getNowProxyNodeName(proxyName)]
}
export const getIPv6ByName = (proxyName: string) => {
  return IPv6Map.value[getNowProxyNodeName(proxyName)]
}
export const fetchProxies = async () => {
  const { data: proxyData } = await fetchProxiesAPI()
  const { data: providerData } = await fetchProxyProviderAPI()
  const sortIndex = proxyData.proxies[GLOBAL].all ?? []

  proxyMap.value = proxyData.proxies
  proxyGroupList.value = Object.values(proxyData.proxies)
    .filter((proxy) => proxy.all?.length && proxy.name !== GLOBAL)
    .sort((prev, next) => sortIndex.indexOf(prev.name) - sortIndex.indexOf(next.name))
    .map((proxy) => proxy.name)

  latencyMap.value = Object.fromEntries(
    Object.entries(proxyData.proxies).map(([name, proxy]) => {
      if (IPv6test.value && getIPv6FromExtra(proxy)) {
        IPv6Map.value[name] = true
      }

      return [name, getLatencyFromHistory(proxy)]
    }),
  )
  proxyProviederList.value = Object.values(providerData.providers).filter(
    (provider) => provider.name !== 'default' && provider.vehicleType !== 'Compatible',
  )
}

export const selectProxy = async (proxyGroup: string, name: string) => {
  await selectProxyAPI(proxyGroup, name)
  proxyMap.value[proxyGroup].now = name

  if (automaticDisconnection.value) {
    activeConnections.value
      .filter((c) => c.chains.includes(proxyGroup))
      .forEach((c) => disconnectByIdAPI(c.id))
  }
  fetchProxies()
}

export const proxyLatencyTest = async (
  proxyName: string,
  url = speedtestUrl.value,
  timeout = speedtestTimeout.value,
) => {
  if (IPv6test.value) {
    try {
      const { data: ipv6LatencyResult } = await fetchProxyLatencyAPI(proxyName, IPV6_TEST_URL, 2000)

      IPv6Map.value[getNowProxyNodeName(proxyName)] = ipv6LatencyResult.delay > NOT_CONNECTED
    } catch {
      IPv6Map.value[getNowProxyNodeName(proxyName)] = false
    }
  }
  try {
    const { data: latencyResult } = await fetchProxyLatencyAPI(proxyName, url, timeout)

    latencyMap.value[getNowProxyNodeName(proxyName)] = latencyResult.delay
  } catch {
    latencyMap.value[getNowProxyNodeName(proxyName)] = NOT_CONNECTED
  }
}

const limiter = pLimit(5)
const { showNotification } = useNotification()

export const proxyGroupLatencyTest = async (proxyGroupName: string) => {
  const proxyNode = proxyMap.value[proxyGroupName]
  const all = proxyNode.all ?? []
  const url = overrideUrlWithConfigIfExists.value
    ? proxyNode.testUrl || speedtestUrl.value
    : speedtestUrl.value

  if (all.length > 20) {
    let testDone = 0

    return await Promise.all(
      all.map((name) =>
        limiter(async () => {
          await proxyLatencyTest(name, url, Math.min(3000, speedtestTimeout.value))
          testDone++
          showNotification({
            content: 'testFinishedTip',
            params: {
              number: `${testDone}/${all.length}`,
            },
            type: testDone === all.length ? 'alert-success' : 'alert-warning',
          })
        }),
      ),
    )
  }

  if (IPv6test.value) {
    try {
      const { data: ipv6LatencyResult } = await fetchProxyGroupLatencyAPI(
        proxyGroupName,
        IPV6_TEST_URL,
        Math.max(5000, speedtestTimeout.value),
      )

      all?.forEach((name) => {
        IPv6Map.value[getNowProxyNodeName(name)] = ipv6LatencyResult[name] > NOT_CONNECTED
      })
    } catch {
      all?.forEach((name) => {
        IPv6Map.value[getNowProxyNodeName(name)] = false
      })
    }
  }
  await fetchProxyGroupLatencyAPI(proxyGroupName, url, speedtestTimeout.value)
  await fetchProxies()
}

export const allProxiesLatencyTest = async () => {
  const proxyNode = Object.keys(proxyMap.value).filter((proxy) => !isProxyGroup(proxy))
  let testDone = 0

  return await Promise.all(
    proxyNode.map((name) =>
      limiter(async () => {
        await proxyLatencyTest(name, speedtestUrl.value, Math.min(3000, speedtestTimeout.value))
        testDone++
        showNotification({
          content: 'testFinishedTip',
          params: {
            number: `${testDone}/${proxyNode.length}`,
          },
          type: testDone === proxyNode.length ? 'alert-success' : 'alert-warning',
        })
      }),
    ),
  )
}

const getLatencyFromHistory = (proxy: Proxy) => {
  return last(proxy.history)?.delay ?? 0
}

const getIPv6FromExtra = (proxy: Proxy) => {
  const ipv6History = proxy.extra?.[IPV6_TEST_URL]?.history

  return (last(ipv6History)?.delay ?? 0) > NOT_CONNECTED
}

const getNowProxyNodeName = (name: string) => {
  let node = proxyMap.value[name]

  if (!name || !node) {
    return name
  }

  while (node.now && node.now !== node.name) {
    const nextNode = proxyMap.value[node.now]

    if (!nextNode) {
      return node.name
    }

    node = nextNode
  }

  return node.name
}

const allIcons = computed(() => {
  return compact(Object.values(proxyMap.value).map((proxy) => proxy.icon))
})

watch(allIcons, async (values) => {
  const allCachedIcons = await getAllIconKeys()

  difference(allCachedIcons, values).forEach((icon) => {
    deleteIconFromIndexedDB(icon)
  })
})
