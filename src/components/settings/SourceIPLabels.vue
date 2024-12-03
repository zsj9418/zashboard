<template>
  <div>{{ $t('sourceIPLabels') }}:</div>
  <div class="flex flex-col gap-2 bg-base-200 p-2">
    <div
      v-for="ip in sourceIPs"
      :key="ip"
      class="flex items-center gap-2"
    >
      {{ ip }} ->
      <input
        type="text"
        class="input input-xs input-bordered w-24"
        v-model="sourceIPLabelMap[ip]"
      />
      <button
        class="btn btn-circle btn-xs bg-base-300"
        @click="() => handlerLabelRemove(ip)"
      >
        <MinusCircleIcon class="h-4 w-4" />
      </button>
    </div>
    <div class="flex w-full items-center gap-2">
      IP:
      <input
        type="text"
        class="input input-xs input-bordered"
        v-model="newLabelForIP.ip"
      />
      <input
        type="text"
        class="input input-xs input-bordered w-20"
        v-model="newLabelForIP.label"
      />
      <button
        class="btn btn-circle btn-xs bg-base-300"
        @click="handlerLabelAdd"
      >
        <PlusIcon class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { sourceIPLabelMap } from '@/store/settings'
import { MinusCircleIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { computed, reactive } from 'vue'

const sourceIPs = computed(() => {
  return Object.keys(sourceIPLabelMap.value)
})

const newLabelForIP = reactive({
  ip: '',
  label: '',
})

const handlerLabelAdd = () => {
  sourceIPLabelMap.value[newLabelForIP.ip] = newLabelForIP.label
  newLabelForIP.ip = ''
  newLabelForIP.label = ''
}

const handlerLabelRemove = (ip: string) => {
  Reflect.deleteProperty(sourceIPLabelMap.value, ip)
  sourceIPLabelMap.value = { ...sourceIPLabelMap.value }
}
</script>
