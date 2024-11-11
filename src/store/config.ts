import { useStorage } from "@vueuse/core";

export enum LANG {
  EN_US = 'en-US',
  ZH_CN = 'zh-CN'
}

export const language = useStorage<LANG>('config/language', LANG.EN_US)
export const isDark = useStorage<boolean>('config/dark', false)
export const speedtestUrl = useStorage<string>('config/speedtest-url', 'http://www.gstatic.com/generate_204')
export const speedtestTimeout = useStorage<number>('config/speedtest-timeout', 5000)