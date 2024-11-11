declare module '*.vue' {
}

export type Proxy = {
  name: string
  type: string
  history: {
    time: string
    delay: number
  }[]
  all?: string[]
  udp: boolean
  now: string
}

export type ProxyGroup = Proxy & {
  all: string[]
}

export type Rule = {
  type: string
  payload: string
  proxy: string
}

export type ConnectionRawMessage = {
  id: string
  download: number
  upload: number
  chains: string[]
  rule: string
  rulePayload: string
  start: string
  metadata: {
    network: string
    type: string
    destinationIP: string
    destinationPort: string
    dnsMode: string
    host: string
    processPath: string
    sourceIP: string
    sourcePort: string
  }
}

export type Connection = ConnectionRawMessage & {
  downloadSpeed: number
  uploadSpeed: number
}

export type Log = {
  type: LOG_LEVEL
  payload: string
}

export type LogWithSeq = Log & { seq: number }
