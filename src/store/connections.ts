import { fetchConnectionsAPI } from "@/api";
import type { Connection, ConnectionRawMessage } from "@/types";
import { useStorage } from "@vueuse/core";
import { computed, ref, watch } from "vue";

export const activeConnections = ref<Connection[]>([])
export const downloadTotal = ref(0)
export const uploadTotal = ref(0)
export const memory = ref(0)

export const quickFilterRegex = useStorage<string>('config/quick-filter-regex', 'dns|direct')
export const quickFilterEnabled = useStorage<boolean>('config/quick-filter-enabled', false)

export enum sortType {
  HOST = 'host',
  RULE = 'rule',
  CHAINS = 'chains',
  DOWNLOAD = 'download',
  DOWNLOAD_SPEED = 'downloadSpeed',
  UPLOAD = 'upload',
  UPLOAD_SPEED = 'uploadSpeed',
  SOURCE_IP = 'sourceIP',
}

const sortFunctionMap: Record<sortType, (a: Connection, b: Connection) => number> = {
  [sortType.HOST]: (a: Connection, b: Connection) => {
    return (a.metadata.host || a.metadata.destinationIP).localeCompare((b.metadata.host || b.metadata.destinationIP))
  },
  [sortType.RULE]: (a: Connection, b: Connection) => {
    return a.rule.localeCompare(b.rule)
  },
  [sortType.CHAINS]: (a: Connection, b: Connection) => {
    return a.chains.join('').localeCompare(b.chains.join(''))
  },
  [sortType.DOWNLOAD]: (a: Connection, b: Connection) => {
    return b.download - a.download
  },
  [sortType.DOWNLOAD_SPEED]: (a: Connection, b: Connection) => {
    return b.downloadSpeed - a.downloadSpeed
  },
  [sortType.UPLOAD]: (a: Connection, b: Connection) => {
    return b.upload - a.upload
  },
  [sortType.UPLOAD_SPEED]: (a: Connection, b: Connection) => {
    return b.uploadSpeed - a.uploadSpeed
  },
  [sortType.SOURCE_IP]: (a: Connection, b: Connection) => {
    return a.metadata.sourceIP.localeCompare(b.metadata.sourceIP)
  },
}

export const connectionSortType = useStorage<sortType>('config/connection-sort-type', sortType.HOST)
export const connectionFilter = ref('')
export const isPaused = ref(false)

export const renderConnections = computed(() => {
  return activeConnections.value.filter((conn) => {
    if (quickFilterEnabled.value && quickFilterRegex.value) {
      const regex = new RegExp(quickFilterRegex.value)

      return !regex.test(conn.chains.join(''))
    }

    return true
  }).filter(conn => {
    if (connectionFilter.value) {
      return [
        conn.metadata.host,
        conn.metadata.destinationIP,
        conn.metadata.destinationPort,
        conn.chains,
        conn.rule,
      ].some(i => i?.includes(connectionFilter.value))
    }

    return true
  }).sort((a, b) => {
    return a.id.localeCompare(b.id)
  }).sort(sortFunctionMap[connectionSortType.value])
})

let cancel: () => void

export const initConnections = () => {
  cancel?.()
  activeConnections.value = []
  
  const ws = fetchConnectionsAPI<string>()
  const unwatch = watch(ws.data, (data) => {
    if (!data) return

    const parsedData = JSON.parse(data) as {
      connections: ConnectionRawMessage[]
      downloadTotal: number
      uploadTotal: number
      memory: number
    }

    downloadTotal.value = parsedData.downloadTotal
    uploadTotal.value = parsedData.uploadTotal
    memory.value = parsedData.memory

    if (isPaused.value) {
      return
    }
    activeConnections.value = parsedData.connections?.map((connection) => {
      const preConnection = activeConnections.value.find((c) => c.id === connection.id) ?? { download: 0, upload: 0 }

      return {
        ...connection,
        downloadSpeed: connection.download - preConnection.download,
        uploadSpeed: connection.upload - preConnection.upload
      }
    }) ?? []
  })

  cancel = () => {
    unwatch()
    ws.close()
  }
}