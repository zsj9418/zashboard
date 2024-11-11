<template>
  <div class="card bg-base-100 w-full p-1 m-1 shadow-xl gap-1 text-sm">
    <div class="flex gap-2">
      <span class="text-primary pl-1">
        {{ conn.metadata.host || conn.metadata.destinationIP }}
        <span class="hidden sm:inline">:{{ conn.metadata.destinationPort }}</span>
      </span>
      <div class="flex-1"></div>
      <div class="badge flex">
        <ArrowDownIcon class="w-4 h-4"/>
        <div class="w-16 flex-1 text-right">{{ prettyBytes(conn.downloadSpeed) }}/s</div>
        <div class="w-16 text-right hidden sm:block">{{ prettyBytes(conn.download) }}</div>
      </div>
      <div class="badge hidden lg:flex">
        <ArrowUpIcon class="w-4 h-4"/>
        <div class="w-16 flex-1 text-right">{{ prettyBytes(conn.uploadSpeed) }}/s</div>
        <div class="w-16 text-right hidden sm:block">{{ prettyBytes(conn.upload) }}</div>
      </div>
      <span class="badge hidden xl:inline">
        {{ conn.metadata.type }}
      </span>
    </div>
    <div class="flex gap-2">
      <span class="badge">
        {{ [...conn.chains].reverse().join(' -> ') }}
      </span>
      <span class="badge hidden lg:inline">
        {{ conn.rule }}
      </span>
      <span class="badge hidden xl:inline">
        {{ conn.metadata.processPath }}
      </span>
      <div class="flex-1"></div>
      <span class="badge hidden sm:inline">
        {{ dayjs(conn.start).locale(language).fromNow() }}
      </span>
      <button class="btn btn-xs btn-circle" @click="emits('info', conn)">
        <InformationCircleIcon class="w-4 h-4"/>
      </button>
      <button class="btn btn-xs btn-circle" @click="disconnectByIdAPI(conn.id)">
        <XMarkIcon class="w-4 h-4"/>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { disconnectByIdAPI } from '@/api';
import { language } from '@/store/config';
import type { Connection } from '@/types';
import { ArrowDownIcon, ArrowUpIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import dayjs from 'dayjs';
import prettyBytes from 'pretty-bytes';

defineProps<{
  conn: Connection
}>()

const emits = defineEmits<{
  (e: 'info', conn: Connection): void
}>()

</script>
