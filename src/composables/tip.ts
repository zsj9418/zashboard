import { i18n } from '@/i18n'
import { ref } from 'vue'

const tipShowModel = ref(false)
const tipContent = ref()
let timmer = -1
const t = i18n.global.t

export const useTip = () => {
  const showTip = (content: string, params: Record<string, string> = {}) => {
    tipShowModel.value = true
    tipContent.value = t(content, params)
    timmer = setTimeout(() => {
      tipShowModel.value = false
      timmer = -1
    }, 10000)
  }

  const setTipContent = (content: string, params: Record<string, string> = {}) => {
    clearTimeout(timmer)
    showTip(content, params)
  }
  return {
    showTip,
    setTipContent,
    tipShowModel,
    tipContent,
  }
}
