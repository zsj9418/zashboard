import { getConfigsAPI, patchConfigsAPI } from '@/api'
import type { Config } from '@/types'
import { useStorage } from '@vueuse/core'
import { ref } from 'vue'

export enum LANG {
  EN_US = 'en-US',
  ZH_CN = 'zh-CN',
}

export const theme = useStorage<string>('config/theme', 'default')
export const language = useStorage<LANG>('config/language', LANG.EN_US)
export const speedtestUrl = useStorage<string>(
  'config/speedtest-url',
  'http://www.gstatic.com/generate_204',
)
export const speedtestTimeout = useStorage<number>('config/speedtest-timeout', 5000)
export const compactConnectionCard = useStorage<boolean>('config/compact-connection-card', true)
export const hostLabelMap = useStorage<Record<string, string>>('config/host-label-map', {})
export const collapseGroupMap = useStorage<Record<string, boolean>>('config/collapse-group-map', {})

export const configs = ref<Config>()
export const fetchConfigs = async () => {
  configs.value = (await getConfigsAPI()).data
}
export const updateConfigs = async (cfg: Record<string, string>) => {
  await patchConfigsAPI(cfg)
  fetchConfigs()
}
