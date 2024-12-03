<template>
  <div class="flex rounded bg-base-200 lg:flex-col">
    <VueDraggable
      class="flex flex-1 flex-col gap-2 bg-base-300 p-2 lg:flex-row"
      v-model="connectionTableColumns"
      :animation="150"
      group="list"
      ghostClass="ghost"
    >
      <div
        v-for="item in connectionTableColumns"
        :key="item"
        class="flex h-8 cursor-move items-center rounded bg-neutral px-2 text-neutral-content shadow-lg"
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
        class="flex h-8 cursor-move items-center rounded bg-neutral px-2 text-neutral-content shadow-lg"
      >
        {{ $t(item) }}
      </div>
    </VueDraggable>
  </div>
</template>

<script setup lang="ts">
import { CONNECTIONS_TABLE_ACCESSOR_KEY } from '@/config'
import { connectionTableColumns } from '@/store/settings'
import { ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'

const restOfColumns = ref(
  Object.values(CONNECTIONS_TABLE_ACCESSOR_KEY).filter(
    (key) => !connectionTableColumns.value.includes(key),
  ),
)
</script>
