<template>
  <ConnectionCardList v-if="useConnectionCard" />
  <ConnectionTable v-else />
  <dialog
    ref="modalRef"
    class="modal"
  >
    <div class="modal-box relative">
      <VueJsonPretty :data="infoConn" />
      <form method="dialog">
        <button class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2 outline-none">
          <XMarkIcon class="h-4 w-4" />
        </button>
      </form>
    </div>
    <form
      method="dialog"
      class="modal-backdrop"
    >
      <button>close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import ConnectionCardList from '@/components/connections/ConnectionCardList.vue'
import ConnectionTable from '@/components/connections/ConnectionTable.vue'
import { useConnections } from '@/composables/connections'
import { useConnectionCard } from '@/store/settings'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

const { infoConn, modalRef } = useConnections()
</script>

<style>
.vjs-tree {
  font-family: inherit !important;
}
.vjs-tree-node.is-highlight,
.vjs-tree-node:hover {
  @apply !bg-base-200;
}
</style>
