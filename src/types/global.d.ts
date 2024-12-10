declare const __APP_VERSION__: string

declare interface Navigator {
  standalone?: boolean
}

type ToolTipParams = {
  data: {
    value: number
    name: number
  }
  seriesName: string
  color: string
}
