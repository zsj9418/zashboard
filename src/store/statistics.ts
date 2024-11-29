import { fetchMemoryAPI, fetchTrafficAPI } from '@/api'
import { ref, watch } from 'vue'

export const memory = ref<number>(0)
export const downloadSpeed = ref<number>(0)
export const uploadSpeed = ref<number>(0)
export const downloadSpeedHistory = ref<number[]>(new Array(60).fill(0))
export const uploadSpeedHistory = ref<number[]>(new Array(60).fill(0))

let cancel: () => void

export const initSatistic = () => {
  cancel?.()

  downloadSpeedHistory.value = new Array(60).fill(0)
  uploadSpeedHistory.value = new Array(60).fill(0)

  const memoryWs = fetchMemoryAPI<string>()
  const unwatchMemory = watch(memoryWs.data, (data) => {
    if (!data) return

    const parsedData = JSON.parse(data) as {
      inuse: number
    }

    memory.value = parsedData.inuse
  })

  const trafficWs = fetchTrafficAPI<string>()
  const unwatchTraffic = watch(trafficWs.data, (data) => {
    if (!data) return

    const parsedData = JSON.parse(data) as {
      up: number
      down: number
    }

    downloadSpeed.value = parsedData.down
    uploadSpeed.value = parsedData.up

    downloadSpeedHistory.value.push(parsedData.down)
    uploadSpeedHistory.value.push(parsedData.up)

    downloadSpeedHistory.value = downloadSpeedHistory.value.slice(-60)
    uploadSpeedHistory.value = uploadSpeedHistory.value.slice(-60)
  })

  cancel = () => {
    memoryWs.close()
    unwatchMemory()
    trafficWs.close()
    unwatchTraffic()
  }
}
