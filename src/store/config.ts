import { getConfigsAPI, patchConfigsAPI } from "@/api";
import { useStorage } from "@vueuse/core";
import { ref } from "vue";

export enum LANG {
  EN_US = 'en-US',
  ZH_CN = 'zh-CN'
}

export const language = useStorage<LANG>('config/language', LANG.EN_US)
export const isDark = useStorage<boolean>('config/dark', false)
export const speedtestUrl = useStorage<string>('config/speedtest-url', 'http://www.gstatic.com/generate_204')
export const speedtestTimeout = useStorage<number>('config/speedtest-timeout', 5000)
export const compactConnectionCard = useStorage<boolean>('config/compact-connection-card', false)
export const hostLabelMap = useStorage<Record<string, string>>('config/host-label-map', {})
export const collapseGroupMap = useStorage<Record<string, boolean>>('config/collapse-group-map', {})

export const configs = ref()
export const fetchConfigs = async () => {
  configs.value = (await getConfigsAPI()).data
}
export const updateConfigs = async (cfg: Record<string, string>) => {
  await patchConfigsAPI(cfg)
  fetchConfigs()
}
