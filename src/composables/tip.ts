import { i18n } from '@/i18n'
import { ref } from 'vue'

const tipShowModel = ref(false)
const tipContent = ref()
const t = i18n.global.t

let timmer = -1

export const useTip = () => {
  const showTip = (content: string, params: Record<string, string> = {}) => {
    clearTimeout(timmer)
    tipShowModel.value = true
    tipContent.value = t(content, params)
    timmer = setTimeout(() => {
      tipShowModel.value = false
      timmer = -1
    }, 5000)
  }

  return {
    showTip,
    tipShowModel,
    tipContent,
  }
}
