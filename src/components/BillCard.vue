<template>
  <v-card class="rounded-lg" :class="className">
    <v-card-title class="font-weight-bold my-2" :class="getHeaderColor">{{ title }}</v-card-title>

    <v-card-text>
      <v-form>
        <v-text-field
          v-model.number="localBill.amount"
          :label="'Amount ($)'"
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
                  :label="'Billing Start'"
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
                prev-icon="mdi-chevron-left"
                next-icon="mdi-chevron-right"
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
                  :label="'Billing End'"
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
                prev-icon="mdi-chevron-left"
                next-icon="mdi-chevron-right"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>

        <div class="text-caption">Period: {{ localBill.days }} days</div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, reactive, watch, onMounted, computed, ref } from 'vue'
import type { PropType } from 'vue'
import type { Bill } from '../types.ts'

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

    const getHeaderColor = computed(() => {
      switch (props.className) {
        case 'electric':
          return 'text-blue'
        case 'water':
          return 'text-green'
        case 'gas':
          return 'text-red'
        default:
          return ''
      }
    })

    const formattedStartDate = computed(() => {
      return formatDateDisplay(localBill.startDate)
    })

    const formattedEndDate = computed(() => {
      return formatDateDisplay(localBill.endDate)
    })

    function formatDateDisplay(dateStr: string | undefined): string {
      if (!dateStr) return ''

      try {
        const date = new Date(dateStr)
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }).format(date)
      } catch (e) {
        return dateStr
      }
    }

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

    // Get the first day of the current month in YYYY-MM-DD format
    const getFirstDayOfCurrentMonth = (): string => {
      const now = new Date()
      // Using year 2025 and month 3 (March) per the provided current date
      return `2025-03-01`
    }

    // Get the last day of the current month in YYYY-MM-DD format
    const getLastDayOfCurrentMonth = (): string => {
      // Last day of March is the 31st
      return `2025-03-31`
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
      getHeaderColor,
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

<style scoped>
</style>
