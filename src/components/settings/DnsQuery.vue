<template>
  <form class="join w-96 max-sm:w-full">
    <TextInput
      v-model="form.name"
      type="text"
      name="name"
      placeholder="Domain Name"
    />
    <select
      v-model="form.type"
      class="join-item select select-bordered select-sm"
    >
      <option value="A">A</option>
      <option value="AAAA">AAAA</option>
      <option value="MX">MX</option>
    </select>
    <button
      class="btn join-item btn-sm"
      type="submit"
      @click="query"
    >
      {{ $t('DNSQuery') }}
    </button>
  </form>
  <div class="max-h-96 overflow-y-auto">
    <div
      class="flex gap-1"
      v-for="item in resultList"
      :key="item.data"
    >
      <div>{{ item.name }}</div>
      :
      <div>{{ item.data }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { queryDNSAPI } from '@/api'
import type { DNSQuery } from '@/types'
import { reactive, ref } from 'vue'
import TextInput from '../common/TextInput.vue'

const form = reactive({
  name: '',
  type: 'A',
})
const resultList = ref<DNSQuery['Answer']>([])
const query = async () => {
  const { data } = await queryDNSAPI(form)
  console.log(data)
  resultList.value = data.Answer
}
</script>
