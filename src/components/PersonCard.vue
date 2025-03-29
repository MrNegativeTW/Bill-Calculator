<template>
  <div class="person-card">
    <h3>Person {{ personIndex }}</h3>
    <div class="date-inputs">
      <div class="date-input">
        <label :for="`start-date-${personIndex}`">Start Date:</label>
        <input
          type="date"
          :id="`start-date-${personIndex}`"
          class="start-date"
          v-model="localPerson.startDate"
          @change="updatePerson"
        />
      </div>
      <div class="date-input">
        <label :for="`end-date-${personIndex}`">End Date:</label>
        <input
          type="date"
          :id="`end-date-${personIndex}`"
          class="end-date"
          v-model="localPerson.endDate"
          @change="updatePerson"
        />
      </div>
    </div>
    <div class="person-days">Occupancy: {{ localPerson.days }} days</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, watch } from 'vue'
import { Person } from '../types.ts'

export default defineComponent({
  name: 'PersonCard',
  props: {
    person: {
      type: Object as PropType<Person>,
      required: true,
    },
    personIndex: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const localPerson = reactive<Person>({ ...props.person })

    watch(
      () => props.person,
      (newValue) => {
        Object.assign(localPerson, newValue)
      },
      { deep: true },
    )

    const updatePerson = (): void => {
      emit('update:person', { ...localPerson })
    }

    return {
      localPerson,
      updatePerson,
    }
  },
})
</script>

<style scoped>
.person-card {
  background-color: white;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.person-card h3 {
  margin-bottom: 15px;
}

.date-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 10px;
}

.person-days {
  font-size: 14px;
  color: #7f8c8d;
  margin-top: 5px;
  text-align: right;
}

.date-input {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label {
  font-weight: 500;
  margin-bottom: 5px;
  color: #34495e;
  font-size: 14px;
}

input {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 15px;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}
</style>
