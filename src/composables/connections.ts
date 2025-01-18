import type { Connection } from '@/types'
import { nextTick, ref } from 'vue'

const infoConn = ref<Connection | null>(null)
const modalRef = ref<{
  showModal: () => void
}>()

export const useConnections = () => {
  const handlerInfo = async (conn: Connection) => {
    infoConn.value = null
    await nextTick()
    infoConn.value = conn
    modalRef.value?.showModal()
  }

  return {
    infoConn,
    modalRef,
    handlerInfo,
  }
}
