import { fetchLogsAPI } from '@/api'
import { LOG_LEVEL } from '@/config'
import type { Log, LogWithSeq } from '@/types'
import { useStorage } from '@vueuse/core'
import { ref, watch } from 'vue'

export const logs = ref<LogWithSeq[]>([])
export const logFilter = ref('')
export const isPaused = ref(false)
export const logLevel = useStorage<string>('config/log-level', LOG_LEVEL.Info)

let cancel: () => void

export const initLogs = () => {
  cancel?.()
  logs.value = []

  let idx = 1
  const ws = fetchLogsAPI<Log>({
    level: logLevel.value,
  })
  const unwatch = watch(ws.data, (data) => {
    if (!data) return

    if (isPaused.value) {
      idx++
      return
    }

    logs.value.unshift({
      ...data,
      time: new Date().valueOf(),
      seq: idx++,
    })

    logs.value = logs.value.slice(0, 1000)
  })

  cancel = () => {
    unwatch()
    ws.close()
  }
}
