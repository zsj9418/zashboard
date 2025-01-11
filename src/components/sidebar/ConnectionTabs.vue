<template>
  <div class="tabs-boxed tabs tabs-sm">
    <a
      role="tab"
      :class="twMerge('tab', connectionTabShow === CONNECTION_TAB_TYPE.ACTIVE && 'tab-active')"
      @click="() => (connectionTabShow = CONNECTION_TAB_TYPE.ACTIVE)"
      >{{ $t('activeConnections') }}
      <template v-if="connectionTabShow === CONNECTION_TAB_TYPE.ACTIVE">
        ({{ renderConnections.length }})
      </template>
    </a>
    <a
      role="tab"
      :class="twMerge('tab', connectionTabShow === CONNECTION_TAB_TYPE.CLOSED && 'tab-active')"
      @click="() => (connectionTabShow = CONNECTION_TAB_TYPE.CLOSED)"
      >{{ $t('closedConnections') }}
      <template v-if="connectionTabShow === CONNECTION_TAB_TYPE.CLOSED">
        ({{ renderConnections.length }})
      </template>
    </a>
  </div>
</template>

<script setup lang="ts">
import { CONNECTION_TAB_TYPE } from '@/config'
import { connectionTabShow, renderConnections } from '@/store/connections'
import { twMerge } from 'tailwind-merge'
</script>
