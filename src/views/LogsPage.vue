<template>
  <div class="flex flex-col">
    <template v-if="!renderLogs.length">
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
            v-for="virtualLog in virtualRows"
            :key="virtualLog.key.toString()"
            :data-index="virtualLog.index"
            :ref="measureElement"
          >
            <div class="card mx-2 mb-1 block p-2 text-sm">
              <span>{{ renderLogs[virtualLog.index].seq }}</span>
              <span class="mx-2 text-primary">
                {{ dayjs(renderLogs[virtualLog.index].time).locale(language).format('HH:mm:ss') }}
              </span>
              <span
                :class="
                  textColorMapForType[
                    renderLogs[virtualLog.index].type as keyof typeof textColorMapForType
                  ]
                "
              >
                {{ renderLogs[virtualLog.index].type }}
              </span>
              <span class="ml-2">{{ renderLogs[virtualLog.index].payload }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LOG_LEVEL } from '@/config'
import { logFilter, logs } from '@/store/logs'
import { language } from '@/store/settings'
import { useVirtualizer } from '@tanstack/vue-virtual'
import dayjs from 'dayjs'
import { computed, ref } from 'vue'

const textColorMapForType = {
  [LOG_LEVEL.Error]: 'text-error',
  [LOG_LEVEL.Warning]: 'text-warning',
  [LOG_LEVEL.Info]: 'text-info',
  [LOG_LEVEL.Debug]: 'text-accent',
}

const renderLogs = computed(() => {
  return logs.value.filter((log) => {
    if (logFilter.value) {
      return log.payload.includes(logFilter.value) || log.type.includes(logFilter.value)
    }

    return true
  })
})

const parentRef = ref<HTMLElement | null>(null)

const virutalOptions = computed(() => {
  return {
    count: renderLogs.value.length,
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
