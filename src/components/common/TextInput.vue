<template>
  <div class="relative w-full flex-1">
    <input
      v-model="inputValue"
      type="text"
      class="input input-sm join-item input-bordered w-full"
    />
    <XMarkIcon
      class="absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 cursor-pointer"
      @click="clearInput"
    />
  </div>
</template>

<script lang="ts" setup>
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: false,
  },
  modelValue: {
    type: String,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])
const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const clearInput = () => {
  inputValue.value = ''
}
</script>
