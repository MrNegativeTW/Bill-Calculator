<template>
  <v-card class="person-result rounded-lg">
    <v-card-title class="my-2">
      Person {{ result.id }}
    </v-card-title>
    
    <v-card-text>
      <div class="text-subtitle-1 text-grey-darken-1 mb-2">
        {{ $t('payment_result_card.occupancy') }} {{ result.totalDays }} {{ $t('global.days') }}
      </div>
      
      <div class="payment-breakdown">
        <!-- Electric bill details -->
        <v-sheet 
          v-if="result.electric.payment > 0"
          class="electric-border mb-2 rounded d-flex justify-space-between align-center"
          :color="isDarkTheme ? 'blue-grey-darken-4' : 'grey-lighten-4'"
        >
          <div class="pa-2">
            <div class="text-subtitle-2">{{ $t('payment_result_card.bill_details.electric') }}</div>
            <div class="text-caption text-grey">{{ result.electric.overlapDays }} {{ $t('payment_result_card.days_overlap') }}</div>
          </div>
          <div class="payment-amount pa-2">${{ result.electric.payment.toFixed(2) }}</div>
        </v-sheet>

        <!-- Water bill details -->
        <div
          v-if="result.water.payment > 0"
          class="water-border mb-2 rounded d-flex justify-space-between align-center"
          :color="isDarkTheme ? undefined : 'blue-grey-lighten-5'"
        >
          <div class="pa-2">
            <div class="text-subtitle-2">{{ $t('payment_result_card.bill_details.water') }}</div>
            <div class="text-caption text-grey">{{ result.water.overlapDays }} {{ $t('payment_result_card.days_overlap') }}</div>
          </div>
          <div class="payment-amount pa-2">${{ result.water.payment.toFixed(2) }}</div>
        </div>

        <!-- Gas bill details -->
        <div
          v-if="result.gas.payment > 0"
          class="gas-border mb-2 rounded d-flex justify-space-between align-center"
          :color="isDarkTheme ? undefined : 'blue-grey-lighten-5'"
        >
          <div class="pa-2">
            <div class="text-subtitle-2">{{ $t('payment_result_card.bill_details.gas') }}</div>
            <div class="text-caption text-grey">{{ result.gas.overlapDays }} {{ $t('payment_result_card.days_overlap') }}</div>
          </div>
          <div class="payment-amount pa-2">${{ result.gas.payment.toFixed(2) }}</div>
        </div>
      </div>
      
      <v-divider class="my-3 border-opacity-50 border-dashed"></v-divider>
      
      <div class="d-flex justify-end text-h6 font-weight-bold">
        {{ $t('payment_result_card.total_payment') }}: ${{ result.totalPayment.toFixed(2) }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { CalculationResult } from '../types'
import { useThemes } from '@/composables/useThemes'

const { isDarkTheme, toggleTheme } = useThemes()

// Define props
defineProps<{
  result: CalculationResult
}>()
</script>

<style scoped>
.payment-amount {
  font-weight: 500;
}
</style>
