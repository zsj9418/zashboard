<template>
  <!-- connections -->
  <div class="card card-compact">
    <div class="card-title px-4 pt-4">
      {{ $t('connections') }}
    </div>
    <div class="card-body">
      <div class="flex items-center gap-2">
        {{ $t('connectionStyle') }}:
        {{ $t('table') }}
        <input
          class="toggle"
          type="checkbox"
          v-model="useConnectionCard"
        />
        {{ $t('card') }}
      </div>
      <ConnectionCardSettings v-if="useConnectionCard" />
      <TableSettings v-else />
      <div class="divider"></div>
      <SourceIPLabels />
    </div>
  </div>
</template>

<script setup lang="ts">
import ConnectionCardSettings from '@/components/settings/ConnectionCardSettings.vue'
import SourceIPLabels from '@/components/settings/SourceIPLabels.vue'
import TableSettings from '@/components/settings/TableSettings.vue'
import { useConnectionCard } from '@/store/settings'
</script>
