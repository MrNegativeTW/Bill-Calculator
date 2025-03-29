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

    <!-- person-section -->
    <div class="person-section">
      <h2>Roommates</h2>
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
        <button id="add-person" @click="addPerson">Add Person</button>
        <button id="remove-person" @click="removePerson" :disabled="people.length <= 1">
          Remove Person
        </button>
      </div>
    </div>

    <button id="calculate-btn" @click="calculatePayment">Calculate Payment</button>

    <!-- results-container -->
    <div class="results" id="results-container" v-if="showResults">
      <h2>Payment Results</h2>
      <div id="results">
        <div class="person-result" v-for="result in results" :key="'result-' + result.id">
          <h3>Person {{ result.id }}</h3>
          <div class="resident-days">Total Occupancy: {{ result.totalDays }} days</div>
          <div class="payment-breakdown">
            <!-- Electric bill details -->
            <div class="bill-payment electric" v-if="bills.electric.amount > 0">
              <div>
                <div class="bill-payment-label">Electric Bill</div>
                <div class="overlap-days">{{ result.electric.overlapDays }} days overlap</div>
              </div>
              <div class="payment-amount">${{ result.electric.payment.toFixed(2) }}</div>
            </div>

            <!-- Water bill details -->
            <div class="bill-payment water" v-if="bills.water.amount > 0">
              <div>
                <div class="bill-payment-label">Water Bill</div>
                <div class="overlap-days">{{ result.water.overlapDays }} days overlap</div>
              </div>
              <div class="payment-amount">${{ result.water.payment.toFixed(2) }}</div>
            </div>

            <!-- Gas bill details -->
            <div class="bill-payment gas" v-if="bills.gas.amount > 0">
              <div>
                <div class="bill-payment-label">Gas Bill</div>
                <div class="overlap-days">{{ result.gas.overlapDays }} days overlap</div>
              </div>
              <div class="payment-amount">${{ result.gas.payment.toFixed(2) }}</div>
            </div>
          </div>
          <div class="total-payment">Total Payment: ${{ result.totalPayment.toFixed(2) }}</div>
        </div>
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
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', 'Arial', sans-serif;
}

body {
  background-color: #f9f9f9;
  padding: 20px;
  color: #333;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  background-color: #fff;
  padding: 30px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
}

h1, h2, h3 {
  color: #2c3e50;
  margin-bottom: 15px;
}

h1 {
  text-align: center;
  font-size: 32px;
  padding-bottom: 10px;
  border-bottom: 2px solid #ecf0f1;
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  color: #7f8c8d;
  margin-bottom: 30px;
  font-size: 16px;
}

h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

h3 {
  font-size: 18px;
  color: #34495e;
}

.bill-section, .person-section, .results {
  margin-bottom: 30px;
  padding: 25px;
  background-color: #f5f7fa;
  border-radius: 10px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.03);
}

.bill-input-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.person-buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

button {
  padding: 12px 18px;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
}

button:active:not(:disabled) {
  transform: translateY(0);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

#add-person {
  background-color: #2ecc71;
  color: white;
}

#add-person:hover:not(:disabled) {
  background-color: #27ae60;
}

#remove-person {
  background-color: #e74c3c;
  color: white;
}

#remove-person:hover:not(:disabled) {
  background-color: #c0392b;
}

#calculate-btn {
  display: block;
  width: 100%;
  padding: 15px;
  font-size: 18px;
  margin: 20px 0;
  background-color: #3498db;
  color: white;
  transition: background-color 0.2s;
}

#calculate-btn:hover {
  background-color: #2980b9;
}

#results {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.person-result {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.person-result h3 {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.resident-days {
  font-size: 15px;
  margin-bottom: 15px;
  color: #555;
}

.payment-breakdown {
  margin-bottom: 20px;
}

.bill-payment {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  margin-bottom: 8px;
  background-color: #f8f9fa;
  border-radius: 5px;
}

.bill-payment.electric {
  border-left: 4px solid #3498db;
}

.bill-payment.water {
  border-left: 4px solid #2ecc71;
}

.bill-payment.gas {
  border-left: 4px solid #e74c3c;
}

.bill-payment-label {
  font-weight: 500;
}

.overlap-days {
  font-size: 13px;
  color: #7f8c8d;
}

.total-payment {
  font-size: 20px;
  font-weight: bold;
  color: #2c3e50;
  text-align: right;
  padding-top: 10px;
  margin-top: 10px;
  border-top: 1px dashed #ddd;
}

.summary {
  margin-top: 30px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.summary h3 {
  margin-bottom: 15px;
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
