<template>
  <div class="relative h-28 rounded-lg bg-base-200/40 p-2 text-sm">
    <div class="flex flex-col gap-1">
      <div>
        <span class="inline-block w-28">Baidu </span>
        :
        <span :class="getColorForLatency(Number(baiduLatency))">{{ baiduLatency }}ms </span>
      </div>
      <div>
        <span class="inline-block w-28">OpenAI </span>
        :
        <span :class="getColorForLatency(Number(openAILatency))">{{ openAILatency }}ms </span>
      </div>
      <div>
        <span class="inline-block w-28">Github </span>
        :
        <span :class="getColorForLatency(Number(githubLatency))">{{ githubLatency }}ms </span>
      </div>
      <div>
        <span class="inline-block w-28">YouTube </span>
        :
        <span :class="getColorForLatency(Number(youtubeLatency))">{{ youtubeLatency }}ms </span>
      </div>
      <div class="absolute right-2 top-2 flex items-center gap-1 text-xs">
        {{ $t('autoCheckWhenStart') }}:
        <input
          class="toggle toggle-xs"
          type="checkbox"
          v-model="autoConnectionCheck"
        />
      </div>
    </div>
    <button
      class="btn btn-circle btn-sm absolute bottom-2 right-2"
      @click="getLatency"
    >
      <BoltIcon class="h-4 w-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import {
  getBaiduLatencyAPI,
  getGithubLatencyAPI,
  getOpenAILatencyAPI,
  getYouTubeLatencyAPI,
} from '@/api'
import { getColorForLatency } from '@/helper'
import { BoltIcon } from '@heroicons/vue/24/outline'
import { useStorage } from '@vueuse/core'
import { onMounted, ref } from 'vue'

const baiduLatency = ref('')
const openAILatency = ref('')
const githubLatency = ref('')
const youtubeLatency = ref('')
const autoConnectionCheck = useStorage('config/auto-connection-check', true)

const getLatency = async () => {
  getBaiduLatencyAPI().then((res) => {
    baiduLatency.value = res.toFixed(0)
  })

  getOpenAILatencyAPI().then((res) => {
    openAILatency.value = res.toFixed(0)
  })

  getGithubLatencyAPI().then((res) => {
    githubLatency.value = res.toFixed(0)
  })

  getYouTubeLatencyAPI().then((res) => {
    youtubeLatency.value = res.toFixed(0)
  })
}

onMounted(() => {
  if (autoConnectionCheck.value) {
    getLatency()
  }
})
</script>
