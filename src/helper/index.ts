import { language } from '@/store/config'
import { useWindowSize } from '@vueuse/core'
import dayjs from 'dayjs'
import { computed } from 'vue'

const windowSize = useWindowSize()

export const isLargeScreen = computed(() => {
  return windowSize.width.value > 1280
})

export const fromNow = (timestamp: string) => {
  return dayjs(timestamp).locale(language.value).fromNow()
}
