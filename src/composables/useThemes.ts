import { ref, inject } from 'vue'
import type { InjectionKey } from 'vue'
import { useTheme } from 'vuetify'

export const isDarkTheme = ref(false)
export type ToggleThemeFunction = () => void

export const ThemeKey: InjectionKey<ToggleThemeFunction> = Symbol('ThemeKey')

export function useThemeManager() {
  const vuetifyTheme = useTheme()
  
  const toggleTheme = () => {
    isDarkTheme.value = !isDarkTheme.value
    vuetifyTheme.global.name.value = isDarkTheme.value ? 'dark' : 'light'
    localStorage.setItem('theme', isDarkTheme.value ? 'dark' : 'light')
  }

  const getSystemTheme = (): boolean => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  const setupSystemThemeListener = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    // Initial check
    if (localStorage.getItem('theme') === null) {
      isDarkTheme.value = mediaQuery.matches
      vuetifyTheme.global.name.value = isDarkTheme.value ? 'dark' : 'light'
    }
    
    // Listen for changes
    mediaQuery.addEventListener('change', (event) => {
      // Only apply system theme if user hasn't manually set a preference
      if (localStorage.getItem('theme') === null) {
        isDarkTheme.value = event.matches
        vuetifyTheme.global.name.value = isDarkTheme.value ? 'dark' : 'light'
      }
    })
  }

  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      isDarkTheme.value = savedTheme === 'dark'
    } else {
      // No saved preference, use system theme
      isDarkTheme.value = getSystemTheme()
    }

    vuetifyTheme.global.name.value = isDarkTheme.value ? 'dark' : 'light'

    setupSystemThemeListener()
  }

  return {
    isDarkTheme,
    toggleTheme,
    initTheme
  }
}

export function useThemes() {
  const toggleTheme = inject(ThemeKey)
  if (!toggleTheme) {
    throw new Error('Theme toggle function was not provided')
  }
  return {
    isDarkTheme,
    toggleTheme
  }
}