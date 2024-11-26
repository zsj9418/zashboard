import { language, PROXY_SORT_TYPE, proxySortType } from '@/store/config'
import { getLatencyByName } from '@/store/proxies'
import { useWindowSize } from '@vueuse/core'
import dayjs from 'dayjs'
import prettyBytes, { type Options } from 'pretty-bytes'
import { computed } from 'vue'

export const prettyBytesHelper = (bytes: number, opts?: Options) => {
  return prettyBytes(bytes, {
    binary: true,
    ...opts,
  })
}

const windowSize = useWindowSize()

export const isLargeScreen = computed(() => {
  return windowSize.width.value > 1280
})

export const fromNow = (timestamp: string) => {
  return dayjs(timestamp).locale(language.value).fromNow()
}

export const getLatencyExceptZero = (name: string) => {
  const latency = getLatencyByName(name)

  return latency === 0 ? Infinity : latency
}

export const sortProxyNodeByType = (proxies: string[]) => {
  proxies = [...proxies]
  switch (proxySortType.value) {
    case PROXY_SORT_TYPE.DEFAULT:
      return proxies
    case PROXY_SORT_TYPE.NAME_ASC:
      return proxies.sort((prev, next) => prev.localeCompare(next))
    case PROXY_SORT_TYPE.NAME_DESC:
      return proxies.sort((prev, next) => next.localeCompare(prev))
    case PROXY_SORT_TYPE.LATENCY_ASC:
      return proxies.sort((prev, next) => getLatencyExceptZero(prev) - getLatencyExceptZero(next))
    case PROXY_SORT_TYPE.LATENCY_DESC:
      return proxies.sort((prev, next) => getLatencyExceptZero(next) - getLatencyExceptZero(prev))
  }
}
