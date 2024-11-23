import { activeBackend } from '@/store/setup'
import type { Config, Proxy, Rule } from '@/types'
import { useWebSocket } from '@vueuse/core'
import axios from 'axios'
import { ref, watch } from 'vue'

axios.interceptors.request.use((config) => {
  config.baseURL =
    activeBackend.value?.protocol +
    '://' +
    activeBackend.value?.host +
    ':' +
    activeBackend.value?.port
  config.headers['Authorization'] = 'Bearer ' + activeBackend.value?.password
  return config
})

export const version = ref()
export const fetchVersionAPI = () => {
  return axios.get<{ version: string }>('/version')
}

watch(
  activeBackend,
  async (val) => {
    if (val) {
      const { data } = await fetchVersionAPI()

      version.value = data.version
    }
  },
  { immediate: true },
)

export const fetchProxiesAPI = () => {
  return axios.get<{ proxies: Record<string, Proxy> }>('/proxies')
}

export const selectProxyAPI = (proxyGroup: string, name: string) => {
  return axios.put(`/proxies/${encodeURIComponent(proxyGroup)}`, { name })
}

export const fetchProxyLatencyAPI = (proxyName: string, url: string, timeout: number) => {
  return axios.get<{ delay: number }>(`/proxies/${encodeURIComponent(proxyName)}/delay`, {
    params: {
      url,
      timeout,
    },
  })
}

export const fetchProxyGroupLatencyAPI = (proxyName: string, url: string, timeout: number) => {
  return axios.get<{ delay: number }>(`/group/${encodeURIComponent(proxyName)}/delay`, {
    params: {
      url,
      timeout,
    },
  })
}

export const getRulesAPI = () => {
  return axios.get<{ rules: Rule[] }>('/rules')
}

export const disconnectByIdAPI = (id: string) => {
  return axios.delete(`/connections/${id}`)
}

export const disconnectAllAPI = () => {
  return axios.delete('/connections')
}

export const getConfigsAPI = () => {
  return axios.get<Config>('/configs')
}

export const patchConfigsAPI = (configs: Record<string, string>) => {
  return axios.patch('/configs', configs)
}

export const flushFakeIPAPI = () => {
  return axios.post('/cache/fakeip/flush')
}

const createWebSocket = <T>(url: string, searchParams?: Record<string, string>) => {
  const backend = activeBackend.value
  const resurl = new URL(
    `${backend?.protocol === 'https' ? 'wss' : 'ws'}://${backend?.host}:${backend?.port}/${url}`,
  )

  resurl.searchParams.append('token', backend?.password || '')

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      resurl.searchParams.append(key, value)
    })
  }

  return useWebSocket<T>(resurl, {
    autoClose: false,
    autoReconnect: true,
  })
}

export const fetchConnectionsAPI = <T>() => {
  return createWebSocket<T>('connections')
}

export const fetchLogsAPI = <T>(params: Record<string, string> = {}) => {
  return createWebSocket<T>('logs', params)
}
