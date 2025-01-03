import { useWindowSize } from '@vueuse/core'
import { computed } from 'vue'

const windowSize = useWindowSize()

export const isLargeScreen = computed(() => {
  return windowSize.width.value > 1280
})

export const isMiddleScreen = computed(() => {
  return windowSize.width.value < 768
})

const BACKGROUND_IMAGE = 'background-image'
export const LOCAL_IMAGE = 'local-image'
export const saveBase64ToIndexedDB = (value: string) => {
  const request = window.indexedDB.open('base64', 1)
  request.onupgradeneeded = () => {
    const db = request.result
    db.createObjectStore('base64', { keyPath: 'key' })
  }
  request.onsuccess = () => {
    const db = request.result
    const tx = db.transaction('base64', 'readwrite')
    const store = tx.objectStore('base64')
    store.put({ key: BACKGROUND_IMAGE, value })
    tx.oncomplete = () => {
      db.close()
    }
  }
}

export const getBase64FromIndexedDB: () => Promise<string> = () => {
  return new Promise((resolve) => {
    const request = window.indexedDB.open('base64', 1)
    request.onsuccess = () => {
      const db = request.result
      const tx = db.transaction('base64', 'readonly')
      const store = tx.objectStore('base64')
      const getRequest = store.get(BACKGROUND_IMAGE)
      getRequest.onsuccess = () => {
        db.close()
        resolve(getRequest.result?.value || '')
      }
    }
  })
}

export const deleteBase64FromIndexedDB = () => {
  const request = window.indexedDB.open('base64', 1)
  request.onsuccess = () => {
    const db = request.result
    const tx = db.transaction('base64', 'readwrite')
    const store = tx.objectStore('base64')
    store.delete(BACKGROUND_IMAGE)
    tx.oncomplete = () => {
      db.close()
    }
  }
}
