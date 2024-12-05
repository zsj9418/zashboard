import { fetchMemoryAPI, fetchTrafficAPI } from '@/api'
import { ref, watch } from 'vue'

const initValue = new Array(60).fill(0).map((v, i) => ({ name: i, value: v }))

export const memory = ref<number>(0)
export const downloadSpeed = ref<number>(0)
export const uploadSpeed = ref<number>(0)
export const downloadSpeedHistory = ref([...initValue])
export const uploadSpeedHistory = ref([...initValue])

let cancel: () => void

export const initSatistic = () => {
  cancel?.()

  downloadSpeedHistory.value = [...initValue]
  uploadSpeedHistory.value = [...initValue]

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
    const timestamp = Date.now().valueOf()

    downloadSpeed.value = parsedData.down
    uploadSpeed.value = parsedData.up

    downloadSpeedHistory.value.push({
      value: parsedData.down,
      name: timestamp,
    })
    uploadSpeedHistory.value.push({
      value: parsedData.up,
      name: timestamp,
    })

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
