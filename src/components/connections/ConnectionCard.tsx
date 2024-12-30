import { useConnections } from '@/composables/connections'
import { CONNECTIONS_TABLE_ACCESSOR_KEY } from '@/config'
import { fromNow, getIPLabelFromMap, getProcessFromConnection, prettyBytesHelper } from '@/helper'
import { connectionCardLines } from '@/store/settings'
import type { Connection } from '@/types'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import { first, last } from 'lodash'
import { defineComponent } from 'vue'
import type { JSX } from 'vue/jsx-runtime'

export default defineComponent<{
  conn: Connection
}>({
  props: {
    conn: Object,
  },
  name: 'ConnectionCard',
  setup(props) {
    const { handlerInfo } = useConnections()

    return () => {
      const componentMap: Record<CONNECTIONS_TABLE_ACCESSOR_KEY, JSX.Element> = {
        [CONNECTIONS_TABLE_ACCESSOR_KEY.Host]: (
          <span class="grow break-all text-primary/80">
            {props.conn.metadata.host || props.conn.metadata.destinationIP}
          </span>
        ),
        [CONNECTIONS_TABLE_ACCESSOR_KEY.Destination]: (
          <span class="grow break-all">{props.conn.metadata.destinationIP}</span>
        ),
        [CONNECTIONS_TABLE_ACCESSOR_KEY.SourceIP]: (
          <span class="grow break-all">{getIPLabelFromMap(props.conn.metadata.sourceIP)}</span>
        ),
        [CONNECTIONS_TABLE_ACCESSOR_KEY.SourcePort]: (
          <span class="grow break-all">{props.conn.metadata.sourcePort}</span>
        ),
        [CONNECTIONS_TABLE_ACCESSOR_KEY.Type]: (
          <span class="grow break-all">{props.conn.metadata.type}</span>
        ),
        [CONNECTIONS_TABLE_ACCESSOR_KEY.Rule]: (
          <span class="grow break-all">
            {props.conn.rule} {props.conn.rulePayload}
          </span>
        ),
        [CONNECTIONS_TABLE_ACCESSOR_KEY.Process]: (
          <span class="grow break-all">{getProcessFromConnection(props.conn)}</span>
        ),
        [CONNECTIONS_TABLE_ACCESSOR_KEY.Chains]: (
          <span class="grow break-all">
            {last(props.conn.chains)}=&gt;{first(props.conn.chains)}
          </span>
        ),
        [CONNECTIONS_TABLE_ACCESSOR_KEY.Download]: (
          <div class="whitespace-nowrap text-right">
            {prettyBytesHelper(props.conn.download)}
            <ArrowDownIcon class="-mt-1 inline-block h-4 w-4" />
          </div>
        ),
        [CONNECTIONS_TABLE_ACCESSOR_KEY.Upload]: (
          <div class="whitespace-nowrap text-right">
            {prettyBytesHelper(props.conn.upload)}
            <ArrowUpIcon class="-mt-1 inline-block h-4 w-4" />
          </div>
        ),
        [CONNECTIONS_TABLE_ACCESSOR_KEY.DlSpeed]: (
          <div class="whitespace-nowrap text-right">
            {prettyBytesHelper(props.conn.downloadSpeed)}/s
            <ArrowDownIcon class="-mt-1 inline-block h-4 w-4" />
          </div>
        ),
        [CONNECTIONS_TABLE_ACCESSOR_KEY.UlSpeed]: (
          <div class="whitespace-nowrap text-right">
            {prettyBytesHelper(props.conn.uploadSpeed)}/s
            <ArrowUpIcon class="-mt-1 inline-block h-4 w-4" />
          </div>
        ),
        [CONNECTIONS_TABLE_ACCESSOR_KEY.ConnectTime]: (
          <div class="whitespace-nowrap text-right">{fromNow(props.conn.start)}</div>
        ),
        [CONNECTIONS_TABLE_ACCESSOR_KEY.Details]: (
          <button
            class="btn btn-circle btn-xs"
            onClick={() => handlerInfo(props.conn)}
          >
            <InformationCircleIcon class="h-4 w-4" />
          </button>
        ),
        [CONNECTIONS_TABLE_ACCESSOR_KEY.Close]: (
          <button
            class="btn btn-circle btn-xs"
            onClick={() => handlerInfo(props.conn)}
          >
            <XMarkIcon class="h-4 w-4" />
          </button>
        ),
      }
      return (
        <div class="card gap-1 p-1">
          {connectionCardLines.value.map((line) => (
            <div class="flex items-center gap-1 text-sm">
              {line.map((key) => {
                return componentMap[key]
              })}
            </div>
          ))}
        </div>
      )
    }
  },
})
