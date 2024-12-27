<template>
  <div class="flex items-center gap-2">
    <div>{{ $t('tableSize') }}:</div>
    <select
      class="select select-bordered select-sm min-w-24"
      v-model="tableSize"
    >
      <option
        v-for="opt in Object.values(TABLE_SIZE)"
        :key="opt"
        :value="opt"
      >
        {{ $t(opt) }}
      </option>
    </select>
  </div>
  <div>{{ $t('customTableColumns') }}:</div>
  <div class="flex rounded lg:flex-col">
    <VueDraggable
      class="flex flex-1 flex-col gap-2 bg-base-200 p-2 lg:flex-row"
      v-model="connectionTableColumns"
      :animation="150"
      group="list"
      ghostClass="ghost"
    >
      <div
        v-for="item in connectionTableColumns"
        :key="item"
        class="flex h-8 cursor-move items-center rounded bg-neutral px-2 text-neutral-content"
      >
        {{ $t(item) }}
      </div>
    </VueDraggable>
    <VueDraggable
      class="flex flex-1 flex-col gap-2 p-2 lg:flex-row"
      v-model="restOfColumns"
      :animation="150"
      group="list"
      ghostClass="ghost"
    >
      <div
        v-for="item in restOfColumns"
        :key="item"
        class="flex h-8 cursor-move items-center rounded bg-neutral px-2 text-neutral-content"
      >
        {{ $t(item) }}
      </div>
    </VueDraggable>
  </div>
</template>

<script setup lang="ts">
import { CONNECTIONS_TABLE_ACCESSOR_KEY, TABLE_SIZE } from '@/config'
import { connectionTableColumns, tableSize } from '@/store/settings'
import { ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'

const restOfColumns = ref(
  Object.values(CONNECTIONS_TABLE_ACCESSOR_KEY).filter(
    (key) => !connectionTableColumns.value.includes(key),
  ),
)
</script>
