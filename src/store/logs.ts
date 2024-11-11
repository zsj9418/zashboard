import { fetchLogsAPI } from "@/api";
import type { Log, LogWithSeq } from "@/types";
import { ref, watch } from "vue";

export const logs = ref<LogWithSeq[]>([])
export const logFilter = ref('')
export const isPaused = ref(false)

export const initLogs = () => {
  const ws = fetchLogsAPI<string>()
  let idx = 1

  logs.value = []
  watch(ws.data, (data) => {
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
}