import { fetchLogsAPI } from "@/api";
import type { Log, LogWithSeq } from "@/types";
import { ref, watch } from "vue";

export const logs = ref<LogWithSeq[]>([])
export const logFilter = ref('')
export const isPaused = ref(false)

let cancel: () => void

export const initLogs = () => {
  cancel?.()
  logs.value = []

  let idx = 1
  const ws = fetchLogsAPI<string>()
  const unwatch = watch(ws.data, (data) => {
    if (!data) return

    const parsedData = JSON.parse(data) as Log

    if (isPaused.value) {
      idx++
      return
    }

    logs.value.unshift({
      ...parsedData,
      seq: idx++
    })

    logs.value = logs.value.slice(0, 1000)
  })

  cancel = () => {
    unwatch()
    ws.close()
  }
}