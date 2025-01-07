<template>
  <ConnectionCardList v-if="useConnectionCard" />
  <ConnectionTable v-else />
  <dialog
    ref="modalRef"
    class="modal"
  >
    <div class="modal-box">
      <VueJsonPretty :data="infoConn" />
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
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

const { infoConn, modalRef } = useConnections()
</script>
