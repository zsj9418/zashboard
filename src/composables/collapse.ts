import { collapseGroupMap } from '@/store/settings'
import { computed, nextTick, ref } from 'vue'

export const useCollapse = (name: string) => {
  const showCollapse = computed({
    get() {
      return collapseGroupMap.value[name]
    },
    set(value) {
      if (value) {
        showPreview.value = false
        showContent.value = true
        nextTick(() => {
          collapseGroupMap.value[name] = true
        })
      } else {
        collapseGroupMap.value[name] = false
      }
    },
  })

  const showContent = ref(showCollapse.value)
  const showPreview = ref(!showCollapse.value)
  const handlerTransitionStart = () => {
    if (!showCollapse.value) {
      setTimeout(() => {
        showPreview.value = !showCollapse.value
      }, 100)
    }
  }
  const handlerTransitionEnd = () => {
    if (!showCollapse.value) {
      showContent.value = false
    }
  }

  return { showCollapse, showContent, showPreview, handlerTransitionEnd, handlerTransitionStart }
}
