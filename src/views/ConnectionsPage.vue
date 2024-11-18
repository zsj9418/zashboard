<template>
  <div class="p-2 h-full overflow-x-hidden overflow-y-auto">
    <template v-if="!renderConnections.length">
      <div class="card bg-base-100 w-full p-2 shadow-xl gap-1 text-sm flex-row">
        {{ $t('noContent') }}
      </div>
    </template>
    <div class="flex flex-col gap-1">
      <ConnectionCard v-for="conn in renderConnections" :key="conn.id" :conn="conn" @info="handlerInfo"></ConnectionCard>
    </div>
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
import ConnectionCard from '@/components/ConnectionCard';
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