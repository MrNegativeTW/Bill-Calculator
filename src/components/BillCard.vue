<template>
  <v-card class="rounded-lg" :class="className" elevation="4">
    <v-card-title class="font-weight-bold my-2">
      <v-icon :icon="getIcon" class="mr-2"></v-icon>
      {{ title }}
    </v-card-title>

    <v-card-text>
      <v-form>
        <v-text-field
          v-model.number="localBill.amount"
          :label="$t('billcard.fields_label.amount')"
          type="number"
          min="0"
          step="0.01"
          prefix="$"
          density="comfortable"
          @input="updateBill"
          variant="outlined"
        ></v-text-field>

        <v-row dense>
          <v-col cols="12">
            <v-menu
              v-model="startDateMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              min-width="auto"
            >
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-model="formattedStartDate"
                  :label="$t('billcard.fields_label.bill_start')"
                  readonly
                  density="comfortable"
                  v-bind="props"
                  variant="outlined"
                >
                  <template v-slot:append-inner>
                    <v-btn
                      icon
                      variant="text"
                      @click.stop="setDefaultStartDate"
                      title="Set to start of current month"
                    >
                      <v-icon>mdi-calendar-start</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </template>
              <v-date-picker
                v-model="localBill.startDate"
                color="primary"
                @update:model-value="startDateSelected"
                show-adjacent-months
              ></v-date-picker>
            </v-menu>
          </v-col>

          <v-col cols="12">
            <v-menu
              v-model="endDateMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              min-width="auto"
            >
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-model="formattedEndDate"
                  :label="$t('billcard.fields_label.bill_end')"
                  readonly
                  density="comfortable"
                  v-bind="props"
                  variant="outlined"
                >
                  <template v-slot:append-inner>
                    <v-btn
                      icon
                      variant="text"
                      @click.stop="setDefaultEndDate"
                      title="Set to end of current month"
                    >
                      <v-icon>mdi-calendar-end</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </template>
              <v-date-picker
                v-model="localBill.endDate"
                color="primary"
                @update:model-value="endDateSelected"
                show-adjacent-months
              ></v-date-picker>
            </v-menu>
          </v-col>

          <v-col cols="12">
            <div class="text-center mb-1">{{ localBill.days }} {{ $t('global.days') }}</div>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, reactive, watch, onMounted, computed, ref } from 'vue'
import type { PropType } from 'vue'
import type { Bill } from '../types.ts'
import {
  getFirstDayOfCurrentMonth,
  getLastDayOfCurrentMonth,
  getFormattedDateDisplay,
} from '../utils/dateUtils'

export default defineComponent({
  name: 'BillCard',
  props: {
    title: {
      type: String,
      required: true,
    },
    bill: {
      type: Object as PropType<Bill>,
      required: true,
    },
    className: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const localBill = reactive<Bill>({ ...props.bill })
    const startDateMenu = ref(false)
    const endDateMenu = ref(false)

    const getIcon = computed(() => {
      switch (props.className) {
        case 'electric':
          return 'mdi-lightning-bolt'
        case 'water':
          return 'mdi-water'
        case 'gas':
          return 'mdi-fire'
        default:
          return 'mdi-file'
      }
    })

    const formattedStartDate = computed(() => {
      return getFormattedDateDisplay(localBill.startDate)
    })

    const formattedEndDate = computed(() => {
      return getFormattedDateDisplay(localBill.endDate)
    })

    function startDateSelected(date: string): void {
      localBill.startDate = date
      startDateMenu.value = false
      updateBill()
    }

    function endDateSelected(date: string): void {
      localBill.endDate = date
      endDateMenu.value = false
      updateBill()
    }

    watch(
      () => props.bill,
      (newValue) => {
        Object.assign(localBill, newValue)
      },
      { deep: true },
    )

    const updateBill = (): void => {
      emit('update:bill', { ...localBill })
    }

    // Set the start date to the first day of the current month
    const setDefaultStartDate = (): void => {
      localBill.startDate = getFirstDayOfCurrentMonth()
      updateBill()
    }

    // Set the end date to the last day of the current month
    const setDefaultEndDate = (): void => {
      localBill.endDate = getLastDayOfCurrentMonth()
      updateBill()
    }

    onMounted(() => {
      // If no dates are set (initial load), set to current month
      if (!localBill.startDate) {
        setDefaultStartDate()
      }
      if (!localBill.endDate) {
        setDefaultEndDate()
      }
    })

    return {
      localBill,
      updateBill,
      setDefaultStartDate,
      setDefaultEndDate,
      getIcon,
      startDateMenu,
      endDateMenu,
      formattedStartDate,
      formattedEndDate,
      startDateSelected,
      endDateSelected,
    }
  },
})
</script>

<style scoped></style>
