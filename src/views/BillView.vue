<template>
  <v-container>
    <div class="text-h4 my-6 font-weight-bold">Bills</div>

    <v-row>
      <!-- Electric Bill -->
      <v-col cols="12" sm="6" md="4" lg="4">
        <BillCard
          title="Electric Bill"
          :bill="bills.electric"
          @update:bill="updateBill('electric', $event)"
          class-name="electric"
        />
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="4">
        <!-- Water Bill -->
        <BillCard
          title="Water Bill"
          :bill="bills.water"
          @update:bill="updateBill('water', $event)"
          class-name="water"
        />
      </v-col>
      <v-col cols="12" sm="6" md="4" lg="4">
        <!-- Gas Bill -->
        <BillCard
          title="Gas Bill"
          :bill="bills.gas"
          @update:bill="updateBill('gas', $event)"
          class-name="gas"
        />
      </v-col>
    </v-row>

    <div class="text-h4 my-6 font-weight-bold">Roommates</div>

    <!-- person-section -->
    <div class="person-section">
      <div id="people-container">
        <PersonCard
          v-for="(person, index) in people"
          :key="index"
          :person="person"
          :person-index="index + 1"
          @update:person="updatePerson(index, $event)"
        />
      </div>
      <div class="person-buttons">
        <v-btn @click="addPerson" color="success" prepend-icon="mdi-plus"> Add Person </v-btn>
        <v-btn
          @click="removePerson"
          color="error"
          prepend-icon="mdi-minus"
          :disabled="people.length <= 1"
        >
          Remove Person
        </v-btn>
      </div>
    </div>

    <v-btn color="primary" size="large" @click="calculatePayment" block> Calculate Payment </v-btn>

    <div class="text-h4 my-6 font-weight-bold">Payment Results</div>

    <!-- results-container -->
    <div class="results" id="results-container" v-if="showResults">
      <div id="results">
        <PaymentResultCard 
          v-for="result in results" 
          :key="'result-' + result.id"
          :result="result"
        />
      </div>
      
      <div class="summary" id="summary-container">
        <h3>Summary</h3>
        <table id="summary-table">
          <thead>
            <tr>
              <th>Person</th>
              <th>Electric</th>
              <th>Water</th>
              <th>Gas</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody id="summary-body">
            <tr v-for="result in results" :key="'summary-' + result.id">
              <td>Person {{ result.id }}</td>
              <td>${{ result.electric.payment.toFixed(2) }}</td>
              <td>${{ result.water.payment.toFixed(2) }}</td>
              <td>${{ result.gas.payment.toFixed(2) }}</td>
              <td>${{ result.totalPayment.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import BillCard from '../components/BillCard.vue'
import PersonCard from '../components/PersonCard.vue'
import PaymentResultCard from '../components/PaymentResultCard.vue'
import type { Bill, Person, CalculationResult, BillType } from '../types'

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
    alert('Please enter at least one bill amount')
    return
  }

  // Validate all bill dates
  for (const billType in bills) {
    const bill = bills[billType as BillType]
    const startDate = new Date(bill.startDate)
    const endDate = new Date(bill.endDate)

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      alert(`Please enter valid dates for the ${billType} bill`)
      return
    }

    if (startDate > endDate) {
      alert(`Start date cannot be after end date for the ${billType} bill`)
      return
    }
  }

  // Validate all person dates
  for (const person of people) {
    const startDate = new Date(person.startDate)
    const endDate = new Date(person.endDate)

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      alert(`Please enter valid dates for Person ${person.id}`)
      return
    }

    if (startDate > endDate) {
      alert(`Start date cannot be after end date for Person ${person.id}`)
      return
    }
  }

  const calculatedResults = calculatePayments()
  results.splice(0, results.length, ...calculatedResults)
  showResults.valueOf = true
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

onMounted(() => {
  calculateDays()
})
</script>

<style scoped>
.person-section,
.results {
  margin-bottom: 30px;
  padding: 25px;
  background-color: #f5f7fa;
  border-radius: 10px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.03);
}

.person-buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

#results {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.summary {
  margin-top: 30px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

#summary-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
}

#summary-table th,
#summary-table td {
  padding: 12px;
  text-align: right;
  border-bottom: 1px solid #eee;
}

#summary-table th:first-child,
#summary-table td:first-child {
  text-align: left;
}

#summary-table th {
  font-weight: 600;
  color: #34495e;
  background-color: #f8f9fa;
}

#summary-table tr:hover {
  background-color: #f9f9f9;
}

#summary-table td:last-child {
  font-weight: bold;
}
</style>
