<template>
  <template v-if="!renderConnections.length">
    <div class="card m-2 flex-row p-2 text-sm">
      {{ $t('noContent') }}
    </div>
  </template>
  <VirtualScroller
    v-else
    :data="renderConnections"
    class="pt-2"
  >
    <template v-slot="{ item }: { item: Connection }">
      <ConnectionCard
        class="mx-2 mb-1"
        :conn="item"
      ></ConnectionCard>
    </template>
  </VirtualScroller>
</template>

<script setup lang="ts">
import { renderConnections } from '@/store/connections'
import type { Connection } from '@/types'
import VirtualScroller from '../common/VirtualScroller.vue'
import ConnectionCard from './ConnectionCard'
</script>
