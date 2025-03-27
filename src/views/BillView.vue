<template>
  <v-container>
    <v-row justify="space-around">
      <!-- Electric Bill -->
      <v-col>
        <BillCard
          title="Electric Bill"
          :bill="bills.electric"
          @update:bill="updateBill('electric', $event)"
          class-name="electric"
        />
      </v-col>

      <v-col>
        <!-- Water Bill -->
        <BillCard
          title="Water Bill"
          :bill="bills.water"
          @update:bill="updateBill('water', $event)"
          class-name="water"
        />
      </v-col>
      <v-col>
        <!-- Gas Bill -->
        <BillCard
          title="Gas Bill"
          :bill="bills.gas"
          @update:bill="updateBill('gas', $event)"
          class-name="gas"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import BillCard from '../components/BillCard.vue'
import { reactive } from 'vue'

// Define bills state
const bills = reactive({
  electric: 0,
  water: 0,
  gas: 0,
})

// Update bill handler
const updateBill = (type: 'electric' | 'water' | 'gas', value: number) => {
  bills[type] = value
}
</script>

<style scoped></style>
