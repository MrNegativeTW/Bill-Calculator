<template>
  <v-layout>
    <v-main>
      <RouterView />
      <v-snackbar
        v-model="snackbar.show"
        :timeout="snackbar.timeout"
        :class="{ 'with-bottom-player': snackbar.withBottomPlayer }"
      >
        {{ snackbar.message }}
      </v-snackbar>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { provide, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useSnackbar, SnackbarKey } from './composables/useSnackbar'
import { useThemeManager, ThemeKey } from './composables/useThemes'

const { snackbar, showSnackbar } = useSnackbar()
provide(SnackbarKey, showSnackbar)

const { toggleTheme, initTheme } = useThemeManager()
provide(ThemeKey, toggleTheme)

onMounted(() => {
  initTheme()
})
</script>

<style scoped>
.with-bottom-player {
  margin-bottom: 80px;
}
</style>
