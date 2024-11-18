
import { disconnectByIdAPI } from '@/api';
import { isLargeScreen } from '@/helper';
import { language, compactConnectionCard } from '@/store/config';
import type { Connection } from '@/types';
import { ArrowDownIcon, ArrowUpIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import dayjs from 'dayjs';
import prettyBytes from 'pretty-bytes';
import { defineComponent } from 'vue';

export default defineComponent<{
  conn: Connection
}>({
  props: {
    conn: Object
  },
  name: 'ConnectionCard',
  setup(props, { emit }) {
    return () => {
      const flex1 = <span class="flex-1"></span>
      const host = (
        <span class="text-primary text-xs md:w-80 shrink-0">
          { props.conn.metadata.host || props.conn.metadata.destinationIP }
          <span class="hidden sm:inline">:{ props.conn.metadata.destinationPort }</span>
        </span>
      )
      const download = (
        <div class="badge bg-base-200 text-base-content text-xs flex">
          <ArrowDownIcon class="w-3 h-4"/>
          <div class="w-14 text-right">{ prettyBytes(props.conn.download) } (</div>
          <div class="w-16 text-right">{ prettyBytes(props.conn.downloadSpeed) }/s )</div>
        </div>
      )
      const uploadCompact = (
        <div class="badge bg-base-200 text-base-content text-xs hidden 2xl:flex">
          <ArrowUpIcon class="w-3 h-4"/>
          <div class="w-14 text-right">{ prettyBytes(props.conn.upload) } (</div>
          <div class="w-16 text-right">{ prettyBytes(props.conn.uploadSpeed) }/s )</div>
        </div>
      )
      const upload = (
        <div class="badge bg-base-200 text-base-content text-xs hidden lg:flex">
          <ArrowUpIcon class="w-3 h-4"/>
          <div class="w-14 text-right">{ prettyBytes(props.conn.upload) } (</div>
          <div class="w-16 text-right">{ prettyBytes(props.conn.uploadSpeed) }/s )</div>
        </div>
      )

      const info = (
        <button class="btn btn-xs btn-circle" onClick={() => emit('info', props.conn)}>
          <InformationCircleIcon class="w-4 h-4"/>
        </button>
      )
      const disconnect = (
        <button onClick={() => disconnectByIdAPI(props.conn.id)}>
          <XMarkIcon class="w-4 h-4"/>
        </button>
      )
      const chians = (
        <span class="text-xs inline w-44 shrink-0">
          { [...props.conn.chains].reverse().join('->') }
        </span>
      )
      const rule = (
        <span class="text-xs w-auto hidden xl:inline">
          { props.conn.rule }
        </span>
      )
      const processPath = (
        <span class={`text-xs w-56 shrink-0 hidden lg:inline`}>
          { props.conn.metadata.processPath }
        </span>
      )
      const startTime = (
        <span class="text-xs inline lg:w-28 shrink-0">
          { dayjs(props.conn.start).locale(language.value).fromNow() }
        </span>
      )
      const type = (
        <span class={`text-xs w-36 shrink-0 hidden xl:inline`}>
          { props.conn.metadata.type } | { props.conn.metadata.network }
        </span>
      )
      const typeCompact = (
        <span class={`text-xs w-36 shrink-0 hidden md:inline`}>
          { props.conn.metadata.type } | { props.conn.metadata.network }
        </span>
      )
      const connection = (
        <span class="text-xs hidden 2xl:flex gap-1 w-60 shrink-0">
          <span>{ props.conn.metadata.sourceIP }:{ props.conn.metadata.sourcePort }</span>
          <span>-&gt;</span>
          <span>{ props.conn.metadata.destinationIP }:{ props.conn.metadata.destinationPort }</span>
        </span>
      )
      const connectionCompact = (
        <span class="text-xs hidden 3xl:flex gap-1 w-60 shrink-0">
          <span>{ props.conn.metadata.sourceIP }</span>
          <span>-&gt;</span>
          <span>{ props.conn.metadata.destinationIP }</span>
        </span>
      )

      if (isLargeScreen.value && compactConnectionCard.value) {
        return (
          <div class="card flex-row items-center w-full bg-base-100 shadow-xl px-2 py-1 gap-1">
            { host }
            { chians }
            { flex1 }
            { connectionCompact }
            { typeCompact }
            { download }
            { uploadCompact }
            { startTime } 
            { info }
            { disconnect }
          </div>
        )
      } else {
        return (
          <div class="card w-full bg-base-100 shadow-xl p-1 gap-1">
            <div class="flex flex-row items-center gap-1 px-1">
              { host }
              { flex1 }
              { connection }
              { type }
              { download }
              { upload }
            </div>
            <div class="flex flex-row items-center gap-1 px-1">
              { chians }
              { rule }
              { flex1 }
              { processPath }
              { startTime }
              { info }
              { disconnect }
            </div>
          </div>
        )
      }
    }
  }
})

