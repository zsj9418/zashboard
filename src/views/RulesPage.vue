<template>
  <div class="p-2 flex flex-col gap-2 h-full overflow-x-hidden overflow-y-auto">
    <div 
      v-for="rule in rules" 
      :key="rule.payload" 
      class="card bg-base-100 w-full p-2 shadow-xl gap-1 text-sm flex-row">
      <div class="w-20 text-primary">{{ rule.proxy }}</div>
      <div class="flex-1">{{ rule.payload }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { rules } from '@/store/rules';

</script>
