<template>
  <div :class="twMerge('flex flex-col gap-2 p-2 text-sm', horizontal && 'flex-row flex-wrap')">
    <ConnectionTabs />
    <div
      :class="twMerge('flex w-full items-center gap-2', horizontal && 'md:w-auto')"
      v-if="useConnectionCard"
    >
      <div class="flex flex-1 items-center gap-1">
        {{ $t('sortBy') }}
        <div class="join flex-1">
          <select
            class="join-item select select-bordered select-sm block flex-1"
            v-model="connectionSortType"
          >
            <option
              v-for="opt in Object.values(SORT_TYPE)"
              :key="opt"
              :value="opt"
            >
              {{ $t(opt) || opt }}
            </option>
          </select>
          <button
            class="btn join-item btn-sm"
            @click="
              connectionSortDirection =
                connectionSortDirection === SORT_DIRECTION.ASC
                  ? SORT_DIRECTION.DESC
                  : SORT_DIRECTION.ASC
            "
          >
            <ArrowUpCircleIcon
              class="h-4 w-4"
              v-if="connectionSortDirection === SORT_DIRECTION.ASC"
            />
            <ArrowDownCircleIcon
              class="h-4 w-4"
              v-else
            />
          </button>
        </div>
      </div>
    </div>
    <div :class="twMerge('relative flex w-full items-center gap-1', horizontal && 'md:w-auto')">
      {{ $t('quickFilter') }}
      <input
        type="checkbox"
        class="toggle"
        v-model="quickFilterEnabled"
      />
      <input
        type="text"
        :class="['input input-sm input-bordered w-0 flex-1', horizontal && 'md:w-48']"
        v-model="quickFilterRegex"
      />
      <div
        :class="`tooltip ${horizontal ? 'tooltip-left md:tooltip-bottom' : 'tooltip-left'}`"
        :data-tip="$t('quickFilterTip')"
      >
        <QuestionMarkCircleIcon class="h-8 w-6 px-1 py-2" />
      </div>
    </div>
    <SourceIPFilter v-if="!horizontal" />
    <div class="flex flex-1 items-center gap-2">
      <div
        class="flex-1"
        :class="horizontal && 'join'"
      >
        <SourceIPFilter
          v-if="horizontal"
          class="w-32 sm:w-40"
        />
        <TextInput
          v-model="connectionFilter"
          class="join-item min-w-32"
          :placeholder="$t('search')"
          :before-close="true"
        />
      </div>
      <button
        class="btn btn-circle btn-sm"
        @click="isPaused = !isPaused"
      >
        <component
          :is="!isPaused ? PauseIcon : PlayIcon"
          class="h-4 w-4"
        />
      </button>
      <button
        class="btn btn-circle btn-sm"
        @click="handlerClickCloseAll"
      >
        <XMarkIcon class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { disconnectByIdAPI } from '@/api'
import { SORT_DIRECTION, SORT_TYPE } from '@/config'
import {
  connectionFilter,
  connectionSortDirection,
  connectionSortType,
  isPaused,
  quickFilterEnabled,
  quickFilterRegex,
  renderConnections,
} from '@/store/connections'
import { useConnectionCard } from '@/store/settings'
import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  PauseIcon,
  PlayIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import { twMerge } from 'tailwind-merge'
import TextInput from '../common/TextInput.vue'
import ConnectionTabs from './ConnectionTabs.vue'
import SourceIPFilter from './SourceIPFilter.vue'
defineProps<{
  horizontal?: boolean
}>()
const handlerClickCloseAll = () => {
  renderConnections.value.forEach((conn) => {
    disconnectByIdAPI(conn.id)
  })
}
</script>

<style scoped>
.tooltip:before {
  width: 200px;
  z-index: 20;
}
</style>
