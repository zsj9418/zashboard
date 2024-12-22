import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const tipShowModel = ref(false)
const tipContent = ref()

export const useTip = () => {
  const { t } = useI18n()
  const showTip = (content: string, params: Record<string, string> = {}) => {
    tipShowModel.value = true
    tipContent.value = t(content, params)
    setTimeout(() => {
      tipShowModel.value = false
    }, 10000)
  }

  return {
    showTip,
    tipShowModel,
    tipContent,
  }
}
