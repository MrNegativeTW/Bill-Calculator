<template>
  <!-- Header Section -->
  <v-card
    class="mb-6 rounded-b-xl elevation-4"
    flat
    width="100%"
    :color="isDarkTheme ? undefined : 'blue-grey-lighten-5'"
  >
    <v-container max-width="900px">
      <!-- Theme toggle button positioned in top right corner -->
      <!-- Let's go full automatically -->
      <!-- <div class="position-absolute" style="top: 16px; right: 16px;">
        <v-btn
          icon
          @click="toggleTheme"
        >
          <v-icon>{{ isDarkTheme ? 'mdi-weather-night' : 'mdi-weather-sunny' }}</v-icon>
        </v-btn>
      </div> -->

      <div class="py-8">
        <div class="text-h3 font-weight-bold mb-2">{{ $t('billview.titles.banner') }}</div>
        <div class="text-subtitle-1 mb-4">
          {{ $t('billview.subtitles.banner') }}
        </div>
        <v-btn
          class="rounded-xl"
          color="primary"
          href="https://github.com/MrNegativeTW/Bill-Calculator"
          target="_blank"
          prepend-icon="mdi-github"
          variant="outlined"
        >
          GitHub
        </v-btn>
      </div>
    </v-container>
  </v-card>

  <v-container class="mb-4" max-width="900px">
    <div class="text-h4 my-6 font-weight-bold">{{ $t('billview.titles.bill') }}</div>

    <v-card
      class="mb-6 pa-4 rounded-lg"
      :color="isDarkTheme ? 'grey-darken-3' : 'blue-grey-lighten-5'"
      flat
    >
      <v-row>
        <!-- Electric Bill -->
        <v-col cols="12" sm="6" md="4" lg="4">
          <BillCard
            :title="$t('billcard.titles.electric')"
            :bill="bills.electric"
            @update:bill="updateBill('electric', $event)"
            class-name="electric"
          />
        </v-col>

        <v-col cols="12" sm="6" md="4" lg="4">
          <!-- Water Bill -->
          <BillCard
            :title="$t('billcard.titles.water')"
            :bill="bills.water"
            @update:bill="updateBill('water', $event)"
            class-name="water"
          />
        </v-col>
        <v-col cols="12" sm="6" md="4" lg="4">
          <!-- Gas Bill -->
          <BillCard
            :title="$t('billcard.titles.gas')"
            :bill="bills.gas"
            @update:bill="updateBill('gas', $event)"
            class-name="gas"
          />
        </v-col>
      </v-row>
    </v-card>

    <div class="text-h4 mt-12 mb-6 font-weight-bold">{{ $t('billview.titles.roommates') }}</div>

    <v-card
      class="mb-6 pa-4 rounded-lg"
      :color="isDarkTheme ? 'grey-darken-3' : 'blue-grey-lighten-5'"
      flat
    >
      <div id="people-container">
        <PersonCard
          v-for="(person, index) in people"
          :key="index"
          :person="person"
          :person-index="index + 1"
          @update:person="updatePerson(index, $event)"
        />
      </div>
      <v-row align="center" justify="center">
        <v-col cols="auto">
          <v-btn
            class="rounded-xl"
            @click="removePerson"
            color="error"
            prepend-icon="mdi-minus"
            :disabled="people.length <= 1"
          >
            {{ $t('billview.buttons.remove_roommate') }}
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn class="rounded-xl" @click="addPerson" color="success" prepend-icon="mdi-plus">{{
            $t('billview.buttons.add_roommate')
          }}</v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-btn
      class="rounded-xl"
      color="primary"
      size="large"
      prepend-icon="mdi-calculator "
      @click="calculatePayment"
      block
      >{{ $t('billview.buttons.calculate') }}</v-btn
    >

    <div class="text-h4 mt-12 mb-6 font-weight-bold">{{ $t('billview.titles.result') }}</div>

    <v-card
      class="mb-6 pa-4 rounded-lg"
      :color="isDarkTheme ? 'grey-darken-3' : 'blue-grey-lighten-5'"
      flat
    >
      <div class="text-h6 font-weight-bold">{{ $t('billview.subtitles.result_overview') }}</div>

      <v-data-table
        class="rounded-lg mt-4 elevation-1"
        :headers="paymentResultTableHeaders"
        :items="results"
        item-value="name"
        density="comfortable"
        fixed-header
        hide-default-footer
      ></v-data-table>

      <div class="text-h6 mt-8 mb-4 font-weight-bold">
        {{ $t('billview.subtitles.result_details') }}
      </div>

      <v-row>
        <v-col cols="12" sm="6" md="4" lg="4" v-for="result in results" :key="result.id">
          <PaymentResultCard :result="result" />
        </v-col>
      </v-row>
    </v-card>

    <div class="mt-12 text-center text-caption" @click="openPrivacy">Privacy</div>
  </v-container>
</template>

<script setup lang="ts">
import { reactive, onMounted, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { SnackbarKey } from '@/composables/useSnackbar'
import { useThemes } from '@/composables/useThemes'
import BillCard from '../components/BillCard.vue'
import PersonCard from '../components/PersonCard.vue'
import PaymentResultCard from '../components/PaymentResultCard.vue'
import type { BillType, Bill, Person, CalculationResult } from '../types'

const { t } = useI18n()

const showSnackbar = inject(SnackbarKey)

const { isDarkTheme, toggleTheme } = useThemes()

// Define initial bill state with proper types
const bills = reactive<Record<BillType, Bill>>({
  electric: {
    amount: 0,
    startDate: '2024-12-13',
    endDate: '2025-02-11',
    days: 0,
  },
  water: {
    amount: 0,
    startDate: '2024-12-04',
    endDate: '2025-02-07',
    days: 0,
  },
  gas: {
    amount: 0,
    startDate: '2024-12-02',
    endDate: '2025-02-02',
    days: 0,
  },
})

// Define other reactive state
const people = reactive<Person[]>([
  {
    id: 1,
    startDate: '2024-12-01',
    endDate: '2025-02-15',
    days: 0,
  },
])

const paymentResultTableHeaders = [
  { title: 'Person', align: 'center' as const, value: 'id' },
  {
    title: 'Electric',
    align: 'end' as const,
    value: 'electric.payment',
    format: (value: number) => `$${value.toFixed(2)}`,
  },
  {
    title: 'Water',
    align: 'end' as const,
    value: 'water.payment',
    format: (value: number) => `$${value.toFixed(2)}`,
  },
  {
    title: 'Gas',
    align: 'end' as const,
    value: 'gas.payment',
    format: (value: number) => `$${value.toFixed(2)}`,
  },
  {
    title: 'Total',
    align: 'end' as const,
    value: 'totalPayment',
    format: (value: number) => `$${value.toFixed(2)}`,
  },
]

const results = reactive<CalculationResult[]>([])
const showResults = reactive<{ value: boolean }>({ value: false })

// Update bill handler with proper typing
const updateBill = (billType: BillType, billData: Bill) => {
  bills[billType] = { ...billData }
  calculateDays()
}

const updatePerson = (index: number, personData: Person) => {
  people[index] = { ...personData }
  calculateDays()
}

const addPerson = () => {
  const newPersonId = people.length + 1
  people.push({
    id: newPersonId,
    startDate: '2024-12-01',
    endDate: '2025-02-15',
    days: 0,
  })
  calculateDays()
}

const removePerson = () => {
  if (people.length > 1) {
    people.pop()
  }
}

// Utility functions
const daysBetweenDates = (startDate: Date, endDate: Date): number => {
  return Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
}

const daysOfOverlap = (
  personStart: Date,
  personEnd: Date,
  billStart: Date,
  billEnd: Date,
): number => {
  const overlapStart = new Date(Math.max(personStart.getTime(), billStart.getTime()))
  const overlapEnd = new Date(Math.min(personEnd.getTime(), billEnd.getTime()))

  if (overlapStart > overlapEnd) {
    return 0
  }

  return daysBetweenDates(overlapStart, overlapEnd)
}

const calculateDays = () => {
  // Calculate days for bills
  for (const billType in bills) {
    const bill = bills[billType as BillType]
    bill.days = daysBetweenDates(new Date(bill.startDate), new Date(bill.endDate))
  }

  // Calculate days for people
  people.forEach((person) => {
    person.days = daysBetweenDates(new Date(person.startDate), new Date(person.endDate))
  })
}

const calculatePayment = (): void => {
  if (bills.electric.amount === 0 && bills.water.amount === 0 && bills.gas.amount === 0) {
    showSnackbar?.(t('billview.errors.invalid_bills'))
    return
  }

  // Validate all bill dates
  for (const billType in bills) {
    const bill = bills[billType as BillType]
    const startDate = new Date(bill.startDate)
    const endDate = new Date(bill.endDate)

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      showSnackbar?.(t('billview.errors.invalid_dates', { id: billType }))
      return
    }

    if (startDate > endDate) {
      showSnackbar?.(t('billview.errors.dates_order'))
      return
    }
  }

  // Validate all person dates
  for (const person of people) {
    const startDate = new Date(person.startDate)
    const endDate = new Date(person.endDate)

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      showSnackbar?.(t('billview.errors.invalid_dates', { id: person.id }))
      return
    }

    if (startDate > endDate) {
      showSnackbar?.(t('billview.errors.dates_order'))
      return
    }
  }

  const calculatedResults = calculatePayments()
  results.splice(0, results.length, ...calculatedResults)
  showResults.value = true
}

const calculatePayments = (): CalculationResult[] => {
  const calculatedResults: CalculationResult[] = []

  // Calculate total overlapping days for each bill
  const totalOverlapDays: Record<BillType, number> = {
    electric: 0,
    water: 0,
    gas: 0,
  }

  // First, calculate total overlapping days for each bill across all people
  for (const person of people) {
    for (const billType in bills) {
      const bill = bills[billType as BillType]
      const overlap = daysOfOverlap(
        new Date(person.startDate),
        new Date(person.endDate),
        new Date(bill.startDate),
        new Date(bill.endDate),
      )
      totalOverlapDays[billType as BillType] += overlap
    }
  }

  // Then, calculate each person's share
  for (const person of people) {
    const personResult: CalculationResult = {
      id: person.id,
      totalDays: daysBetweenDates(new Date(person.startDate), new Date(person.endDate)),
      electric: {
        overlapDays: daysOfOverlap(
          new Date(person.startDate),
          new Date(person.endDate),
          new Date(bills.electric.startDate),
          new Date(bills.electric.endDate),
        ),
        payment: 0,
      },
      water: {
        overlapDays: daysOfOverlap(
          new Date(person.startDate),
          new Date(person.endDate),
          new Date(bills.water.startDate),
          new Date(bills.water.endDate),
        ),
        payment: 0,
      },
      gas: {
        overlapDays: daysOfOverlap(
          new Date(person.startDate),
          new Date(person.endDate),
          new Date(bills.gas.startDate),
          new Date(bills.gas.endDate),
        ),
        payment: 0,
      },
      totalPayment: 0,
    }

    // Calculate payment for each bill based on overlapping days
    for (const billType in bills) {
      const bill = bills[billType as BillType]
      if (totalOverlapDays[billType as BillType] > 0 && bill.amount > 0) {
        personResult[billType as BillType].payment =
          (personResult[billType as BillType].overlapDays /
            totalOverlapDays[billType as BillType]) *
          bill.amount
        personResult.totalPayment += personResult[billType as BillType].payment
      }
    }

    calculatedResults.push(personResult)
  }

  return calculatedResults
}

const openPrivacy = () => {
  showSnackbar?.("We don't do that here.")
}

onMounted(() => {
  calculateDays()
})
</script>

<style scoped></style>
