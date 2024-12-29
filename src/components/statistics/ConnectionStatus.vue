<template>
  <div class="relative rounded-lg bg-base-200/40 p-4 text-sm">
    <div class="flex flex-col gap-2">
      <div>
        <span class="inline-block w-28">Baidu </span>
        :
        <span :class="getColorForLatency(Number(baiduLatency))">{{ baiduLatency }}ms </span>
      </div>
      <div>
        <span class="inline-block w-28">NeteaseMusic </span>
        :
        <span :class="getColorForLatency(Number(neteaseMusicLatency))"
          >{{ neteaseMusicLatency }}ms
        </span>
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
    </div>
    <div>
      <button
        class="btn btn-circle btn-sm absolute right-2 top-2"
        @click="getLatency"
      >
        <BoltIcon class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  getBaiduLatencyAPI,
  getGithubLatencyAPI,
  getNeteaseMusicLatencyAPI,
  getYouTubeLatencyAPI,
} from '@/api'
import { getColorForLatency } from '@/helper'
import { BoltIcon } from '@heroicons/vue/24/outline'
import { onMounted, ref } from 'vue'

const baiduLatency = ref('')
const neteaseMusicLatency = ref('')
const githubLatency = ref('')
const youtubeLatency = ref('')

const getLatency = async () => {
  getBaiduLatencyAPI().then((res) => {
    baiduLatency.value = res.toFixed(0)
  })

  getNeteaseMusicLatencyAPI().then((res) => {
    neteaseMusicLatency.value = res.toFixed(0)
  })

  getGithubLatencyAPI().then((res) => {
    githubLatency.value = res.toFixed(0)
  })

  getYouTubeLatencyAPI().then((res) => {
    youtubeLatency.value = res.toFixed(0)
  })
}

onMounted(() => {
  getLatency()
})
</script>
