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
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { provide } from 'vue'
import { useSnackbar, SnackbarKey } from './composables/useSnackbar'

const { snackbar, showSnackbar } = useSnackbar()
provide(SnackbarKey, showSnackbar)
</script>

<style scoped>
.with-bottom-player {
  margin-bottom: 80px;
}
</style>
