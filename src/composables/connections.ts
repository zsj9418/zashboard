import type { Connection } from '@/types'
import { ref } from 'vue'

const infoConn = ref<Connection>()
const modalRef = ref<{
  showModal: () => void
}>()

export const useConnections = () => {
  const handlerInfo = (conn: Connection) => {
    infoConn.value = conn
    modalRef.value?.showModal()
  }

  return {
    infoConn,
    modalRef,
    handlerInfo,
  }
}
