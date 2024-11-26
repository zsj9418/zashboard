declare module '*.vue' {}
declare module '*.tsx' {}

export type Config = {
  port: number
  'socks-port': number
  'redir-port': number
  'tproxy-port': number
  'mixed-port': number
  'allow-lan': boolean
  'bind-address': string
  mode: string
  'mode-list': string[]
  'log-level': string
  ipv6: boolean
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

export type SubscriptionInfo = {
  Download?: number
  Upload?: number
  Total?: number
  Expire?: number
}

export type ProxyProvider = {
  subscriptionInfo?: SubscriptionInfo
  name: string
  proxies: ProxyNode[]
  testUrl: string
  updatedAt: string
  vehicleType: string
}

export type Rule = {
  type: string
  payload: string
  proxy: string
}

export type RuleProvider = {
  behavior: string
  format: string
  name: string
  ruleCount: number
  type: string
  updatedAt: string
  vehicleType: string
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
  type: 'info' | 'warning' | 'error' | 'debug'
  payload: string
}

export type LogWithSeq = Log & { seq: number }
