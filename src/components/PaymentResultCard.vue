<template>
  <v-card class="person-result rounded-lg">
    <v-card-title class="my-2">
      Person {{ result.id }}
    </v-card-title>
    
    <v-card-text>
      <div class="text-subtitle-1 text-grey-darken-1 mb-2">
        Occupancy: {{ result.totalDays }} days
      </div>
      
      <div class="payment-breakdown">
        <!-- Electric bill details -->
        <div 
          v-if="result.electric.payment > 0"
          class="bill-payment electric-border mb-2 rounded d-flex justify-space-between align-center"
        >
          <div class="pa-2">
            <div class="text-subtitle-2">Electric Bill</div>
            <div class="text-caption text-grey">{{ result.electric.overlapDays }} days overlap</div>
          </div>
          <div class="payment-amount pa-2">${{ result.electric.payment.toFixed(2) }}</div>
        </div>

        <!-- Water bill details -->
        <div
          v-if="result.water.payment > 0"
          class="bill-payment water-border mb-2 rounded d-flex justify-space-between align-center"
        >
          <div class="pa-2">
            <div class="text-subtitle-2">Water Bill</div>
            <div class="text-caption text-grey">{{ result.water.overlapDays }} days overlap</div>
          </div>
          <div class="payment-amount pa-2">${{ result.water.payment.toFixed(2) }}</div>
        </div>

        <!-- Gas bill details -->
        <div
          v-if="result.gas.payment > 0"
          class="bill-payment gas-border mb-2 rounded d-flex justify-space-between align-center"
        >
          <div class="pa-2">
            <div class="text-subtitle-2">Gas Bill</div>
            <div class="text-caption text-grey">{{ result.gas.overlapDays }} days overlap</div>
          </div>
          <div class="payment-amount pa-2">${{ result.gas.payment.toFixed(2) }}</div>
        </div>
      </div>
      
      <v-divider class="my-3 border-opacity-50 border-dashed"></v-divider>
      
      <div class="d-flex justify-end text-h6 font-weight-bold">
        Total: ${{ result.totalPayment.toFixed(2) }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { CalculationResult } from '../types'

// Define props
defineProps<{
  result: CalculationResult
}>()
</script>

<style scoped>
.bill-payment {
  background-color: rgb(248, 249, 250);
}

.payment-amount {
  font-weight: 500;
}

.electric-border {
  /* border-left: 4px solid #1976d2;*/ /* Vuetify blue */
}

.water-border {
  /* border-left: 4px solid #4caf50;*/ /* Vuetify green */
}

.gas-border {
  /* border-left: 4px solid #f44336;*/ /* Vuetify red */
}
</style>
