import { fetchMemoryAPI } from '@/api'
import { ref, watch } from 'vue'

export const memory = ref<number>(0)
export const download = ref<number>(0)
export const upload = ref<number>(0)
let cancel: () => void

export const initSatistic = () => {
  cancel?.()

  const memoryWs = fetchMemoryAPI<string>()
  const unwatchMemory = watch(memoryWs.data, (data) => {
    if (!data) return

    const parsedData = JSON.parse(data) as {
      inuse: number
    }

    memory.value = parsedData.inuse
  })

  cancel = () => {
    memoryWs.close()
    unwatchMemory()
  }
}
