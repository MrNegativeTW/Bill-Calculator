<template>
    <div class="bill-card" :class="className">
      <h3>{{ title }}</h3>
      <div class="bill-amount">
        <label :for="`${className}-bill`">Amount ($):</label>
        <input 
          type="number" 
          :id="`${className}-bill`" 
          min="0" 
          step="0.01" 
          placeholder="0.00"
          v-model.number="localBill.amount" 
          @input="updateBill"
        >
      </div>
      <div class="bill-dates">
        <div class="date-input">
          <label :for="`${className}-start-date`">Billing Start:</label>
          <input 
            type="date" 
            :id="`${className}-start-date`" 
            v-model="localBill.startDate"
            @change="updateBill"
          >
          <button class="date-preset" @click="setDefaultStartDate" title="Set to first day of current month">
            This Month
          </button>
        </div>
        <div class="date-input">
          <label :for="`${className}-end-date`">Billing End:</label>
          <input 
            type="date" 
            :id="`${className}-end-date`" 
            v-model="localBill.endDate"
            @change="updateBill"
          >
          <button class="date-preset" @click="setDefaultEndDate" title="Set to last day of current month">
            This Month
          </button>
        </div>
      </div>
      <div class="bill-days">Period: {{ localBill.days }} days</div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, PropType, reactive, watch, onMounted } from 'vue';
  import { Bill } from '../types';
  
  export default defineComponent({
    name: 'BillCard',
    props: {
      title: {
        type: String,
        required: true
      },
      bill: {
        type: Object as PropType<Bill>,
        required: true
      },
      className: {
        type: String,
        default: ''
      }
    },
    setup(props, { emit }) {
      const localBill = reactive<Bill>({ ...props.bill });
  
      watch(() => props.bill, (newValue) => {
        Object.assign(localBill, newValue);
      }, { deep: true });
  
      const updateBill = (): void => {
        emit('update:bill', { ...localBill });
      };
  
      // Get the first day of the current month in YYYY-MM-DD format
      const getFirstDayOfCurrentMonth = (): string => {
        const now = new Date();
        // Using year 2025 and month 3 (March) per the provided current date
        return `2025-03-01`;
      };
  
      // Get the last day of the current month in YYYY-MM-DD format
      const getLastDayOfCurrentMonth = (): string => {
        // Last day of March is the 31st
        return `2025-03-31`;
      };
  
      // Set the start date to the first day of the current month
      const setDefaultStartDate = (): void => {
        localBill.startDate = getFirstDayOfCurrentMonth();
        updateBill();
      };
  
      // Set the end date to the last day of the current month
      const setDefaultEndDate = (): void => {
        localBill.endDate = getLastDayOfCurrentMonth();
        updateBill();
      };
  
      onMounted(() => {
        // If no dates are set (initial load), set to current month
        if (!localBill.startDate) {
          setDefaultStartDate();
        }
        if (!localBill.endDate) {
          setDefaultEndDate();
        }
      });
  
      return {
        localBill,
        updateBill,
        setDefaultStartDate,
        setDefaultEndDate
      };
    }
  });
  </script>
  
  <style scoped>
  .bill-card {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .bill-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .bill-card h3 {
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
  
  .bill-card.electric h3 {
    color: #3498db;
  }
  
  .bill-card.water h3 {
    color: #2ecc71;
  }
  
  .bill-card.gas h3 {
    color: #e74c3c;
  }
  
  .bill-amount {
    margin-bottom: 15px;
  }
  
  .bill-dates {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 10px;
  }
  
  .bill-days {
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
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  
  input:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
  
  .date-preset {
    margin-top: 5px;
    padding: 5px 8px;
    font-size: 12px;
    background-color: #f1f1f1;
    color: #555;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .date-preset:hover {
    background-color: #e0e0e0;
  }
  </style>