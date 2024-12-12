<template>
  <template v-if="!renderConnections.length">
    <div class="card m-2 flex-row p-2 text-sm">
      {{ $t('noContent') }}
    </div>
  </template>
  <div
    ref="parentRef"
    class="h-full w-full overflow-auto"
  >
    <div
      :style="{
        height: `${totalSize}px`,
      }"
      class="relative w-full"
    >
      <div
        class="absolute left-0 top-0 w-full"
        :style="{
          transform: `translateY(${virtualRows[0]?.start ?? 0}px)`,
        }"
      >
        <div
          v-for="virtualConn in virtualRows"
          :key="virtualConn.key.toString()"
          :data-index="virtualConn.index"
          :ref="measureElement"
        >
          <ConnectionCard
            class="mx-2 mb-1"
            :conn="renderConnections[virtualConn.index]"
          ></ConnectionCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { renderConnections } from '@/store/connections'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { computed, ref } from 'vue'
import ConnectionCard from './ConnectionCard'

const parentRef = ref<HTMLElement | null>(null)

const virutalOptions = computed(() => {
  return {
    count: renderConnections.value.length,
    getScrollElement: () => parentRef.value,
    estimateSize: () => 55,
    overscan: 48,
  }
})

const rowVirtualizer = useVirtualizer(virutalOptions)

const virtualRows = computed(() => rowVirtualizer.value.getVirtualItems())
const totalSize = computed(() => rowVirtualizer.value.getTotalSize())

const measureElement = (el: Element) => {
  if (!el) {
    return
  }

  rowVirtualizer.value.measureElement(el)

  return undefined
}
</script>
