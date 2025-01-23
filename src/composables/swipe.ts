import { ROUTE_NAME } from '@/config'
import { renderRoutes } from '@/helper'
import { useSwipe } from '@vueuse/core'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export const disableSwipe = ref(false)

export const useSwipeRouter = () => {
  const route = useRoute()
  const router = useRouter()
  const swiperRef = ref()
  const { direction } = useSwipe(swiperRef, { threshold: 75 })

  const getNextRouteName = () => {
    const routeName = route.name as ROUTE_NAME

    if (routeName === ROUTE_NAME.setup) {
      return ROUTE_NAME.proxies
    }

    return renderRoutes.value[
      (renderRoutes.value.indexOf(routeName) + 1) % renderRoutes.value.length
    ]
  }
  const getPrevRouteName = () => {
    const routeName = route.name as ROUTE_NAME

    if (routeName === ROUTE_NAME.setup) {
      return ROUTE_NAME.proxies
    }

    return renderRoutes.value[
      (renderRoutes.value.indexOf(routeName) - 1 + renderRoutes.value.length) %
        renderRoutes.value.length
    ]
  }

  watch(direction, () => {
    if (disableSwipe.value || window.getSelection()?.toString()?.length) return
    if (direction.value === 'right') {
      router.push({ name: getPrevRouteName() })
    } else if (direction.value === 'left') {
      router.push({ name: getNextRouteName() })
    }
  })

  return {
    swiperRef,
  }
}
