import { fetchIsUIUpdateAvailable, upgradeCoreAPI } from '@/api'
import { autoUpdate } from '@/store/settings'
import { ref } from 'vue'

const isUIUpdateAvailable = ref(false)

export const useSettings = () => {
  const checkUIUpdate = async () => {
    isUIUpdateAvailable.value = await fetchIsUIUpdateAvailable()
    if (isUIUpdateAvailable.value && autoUpdate.value) {
      upgradeCoreAPI()
    }
  }

  return {
    isUIUpdateAvailable,
    checkUIUpdate,
  }
}
