<template>
  <div class="p-2 h-full overflow-x-hidden overflow-y-auto">
    <ConnectionCard v-for="conn in renderConnections" :key="conn.id" :conn="conn" @info="handlerInfo"></ConnectionCard>
    <dialog ref="modalRef" class="modal">
      <div class="modal-box">
        <VueJsonPretty :data="infoConn" />
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import ConnectionCard from '@/components/ConnectionCard.vue';
import { renderConnections } from '@/store/connections';
import type { Connection } from '@/types';
import { ref } from 'vue';
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css';

const infoConn = ref<Connection>()
const modalRef = ref<{
  showModal: () => void
}>()

const handlerInfo = (conn: Connection) => {
  infoConn.value = conn
  modalRef.value?.showModal()
}

</script>