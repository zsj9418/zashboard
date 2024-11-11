import { fetchConnectionsAPI } from "@/api";
import type { Connection, ConnectionRawMessage } from "@/types";
import { computed, ref, watch } from "vue";

export const activeConnections = ref<Connection[]>([])
export const downloadTotal = ref(0)
export const uploadTotal = ref(0)
export const memory = ref(0)

export const connectionFilter = ref('')
export const isPaused = ref(false)

export const renderConnections = computed(() => {
  return activeConnections.value.filter(conn => {
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
    const hostA = a.metadata.host || a.metadata.destinationIP
    const hostB = b.metadata.host || b.metadata.destinationIP

    if (hostA === hostB) {
      return a.id.localeCompare(b.id)
    }

    return hostA.localeCompare(hostB)
  })
})

export const initConnections = () => {
  const ws = fetchConnectionsAPI<string>()
  
  activeConnections.value = []
  watch(ws.data, (data) => {
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
    activeConnections.value = parsedData.connections.map((connection) => {
      const preConnection = activeConnections.value.find((c) => c.id === connection.id) ?? { download: 0, upload: 0 }

      return {
        ...connection,
        downloadSpeed: connection.download - preConnection.download,
        uploadSpeed: connection.upload - preConnection.upload
      }
    })
  })
}