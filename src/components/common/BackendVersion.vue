<template>
  <div class="flex items-center gap-1">
    {{ $t('version') }}:
    <img
      :src="isSingBox ? SingBoxLogo : MetacubexLogo"
      class="h-4 w-4"
    />
    {{ version }}
  </div>
</template>

<script setup lang="ts">
import { isSingBox, version } from '@/api'
import MetacubexLogo from '@/assets/metacubex.jpeg'
import SingBoxLogo from '@/assets/sing-box.svg'
</script>
