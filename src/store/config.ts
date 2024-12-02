import { getConfigsAPI, patchConfigsAPI } from '@/api'
import type { Config } from '@/types'
import { ref } from 'vue'

export const configs = ref<Config>()
export const fetchConfigs = async () => {
  configs.value = (await getConfigsAPI()).data
}
export const updateConfigs = async (cfg: Record<string, string | boolean | object>) => {
  await patchConfigsAPI(cfg)
  fetchConfigs()
}
