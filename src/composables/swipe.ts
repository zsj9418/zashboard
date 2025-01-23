import { CONNECTION_TAB_TYPE, PROXY_TAB_TYPE, ROUTE_NAME, RULE_TAB_TYPE } from '@/config'
import { renderRoutes } from '@/helper'
import { connectionTabShow } from '@/store/connections'
import { proxyProviederList } from '@/store/proxies'
import { ruleProviderList } from '@/store/rules'
import { useSwipe } from '@vueuse/core'
import { flatten } from 'lodash'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProxies } from './proxies'
import { rulesTabShow } from './rules'

export const disableSwipe = ref(false)

export const useSwipeRouter = () => {
  const route = useRoute()
  const router = useRouter()
  const { proxiesTabShow } = useProxies()
  const swiperRef = ref()
  const { direction } = useSwipe(swiperRef, { threshold: 75 })

  const swipeList = computed(() => {
    return flatten(
      renderRoutes.value.map((r) => {
        if (r === ROUTE_NAME.proxies && proxyProviederList.value.length > 0) {
          return [
            [
              () =>
                route.name === ROUTE_NAME.proxies &&
                proxiesTabShow.value === PROXY_TAB_TYPE.PROXIES,
              () => {
                router.push({ name: ROUTE_NAME.proxies })
                proxiesTabShow.value = PROXY_TAB_TYPE.PROXIES
              },
            ],
            [
              () =>
                route.name === ROUTE_NAME.proxies &&
                proxiesTabShow.value === PROXY_TAB_TYPE.PROVIDER,
              () => {
                router.push({ name: ROUTE_NAME.proxies })
                proxiesTabShow.value = PROXY_TAB_TYPE.PROVIDER
              },
            ],
          ]
        } else if (r === ROUTE_NAME.connections) {
          return [
            [
              () =>
                route.name === ROUTE_NAME.connections &&
                connectionTabShow.value === CONNECTION_TAB_TYPE.ACTIVE,
              () => {
                router.push({ name: ROUTE_NAME.connections })
                connectionTabShow.value = CONNECTION_TAB_TYPE.ACTIVE
              },
            ],
            [
              () =>
                route.name === ROUTE_NAME.connections &&
                connectionTabShow.value === CONNECTION_TAB_TYPE.CLOSED,
              () => {
                router.push({ name: ROUTE_NAME.connections })
                connectionTabShow.value = CONNECTION_TAB_TYPE.CLOSED
              },
            ],
          ]
        } else if (r === ROUTE_NAME.rules && ruleProviderList.value.length > 0) {
          return [
            [
              () => route.name === ROUTE_NAME.rules && rulesTabShow.value === RULE_TAB_TYPE.RULES,
              () => {
                router.push({ name: ROUTE_NAME.rules })
                rulesTabShow.value = RULE_TAB_TYPE.RULES
              },
            ],
            [
              () =>
                route.name === ROUTE_NAME.rules && rulesTabShow.value === RULE_TAB_TYPE.PROVIDER,
              () => {
                router.push({ name: ROUTE_NAME.rules })
                rulesTabShow.value = RULE_TAB_TYPE.PROVIDER
              },
            ],
          ]
        }

        return [[() => route.name === r, () => router.push({ name: r })]]
      }),
    )
  })

  const getNextIndexInSwipeList = () => {
    return swipeList.value.findIndex((s) => s[0]())
  }

  const getNextRouteName = () => {
    const routeName = route.name as ROUTE_NAME

    if (routeName === ROUTE_NAME.setup) {
      return router.push({ name: ROUTE_NAME.proxies })
    }

    return swipeList.value[(getNextIndexInSwipeList() + 1) % swipeList.value.length]?.[1]?.()
  }
  const getPrevRouteName = () => {
    const routeName = route.name as ROUTE_NAME

    if (routeName === ROUTE_NAME.setup) {
      return router.push({ name: ROUTE_NAME.proxies })
    }

    return swipeList.value[
      (getNextIndexInSwipeList() - 1 + swipeList.value.length) % swipeList.value.length
    ]?.[1]?.()
  }

  watch(direction, () => {
    if (disableSwipe.value || window.getSelection()?.toString()?.length) return
    if (direction.value === 'right') {
      getPrevRouteName()
    } else if (direction.value === 'left') {
      getNextRouteName()
    }
  })

  return {
    swiperRef,
  }
}
