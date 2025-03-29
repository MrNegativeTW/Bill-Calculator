import { ref } from 'vue'
import type { InjectionKey } from 'vue'

type SnackbarFunction = (msg: string, duration?: number) => void;

export const SnackbarKey = Symbol() as InjectionKey<SnackbarFunction>

export function useSnackbar() {
  const snackbar = ref({
    show: false,
    message: '',
    timeout: 3000,
    withBottomPlayer: false
  })

  const showSnackbar: SnackbarFunction = (msg = '', duration = 3000) => {
    snackbar.value.message = msg
    snackbar.value.show = true
    clearTimeout(snackbar.value.timeout)
    setTimeout(() => {
      snackbar.value.show = false
    }, duration)
  }

  return {
    snackbar,
    showSnackbar
  }
}
