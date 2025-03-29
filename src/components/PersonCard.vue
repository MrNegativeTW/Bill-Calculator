<template>
  <v-card class="mb-6 rounded-lg">
    <v-card-text>
      <v-row align="center">
        <v-col cols="12" sm="12" md="3" lg="3">
          <h3 class="text-h6 text-center">Person {{ personIndex }}</h3>
        </v-col>

        <v-col cols="12" sm="12" md="3" lg="3">
          <v-menu
            v-model="startDateMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                v-bind="props"
                v-model="formattedStartDate"
                label="Start Date"
                hide-details="auto"
                readonly
                @click="startDateMenu = true"
                density="comfortable"
                variant="outlined"
              >
                    <template v-slot:append-inner>
                        <v-btn
                        icon
                        variant="text"
                        title="Set to start of current month"
                        >
                        <v-icon>mdi-calendar-start</v-icon>
                        </v-btn>
                    </template>
                </v-text-field>
            </template>
            <v-date-picker
              v-model="localPerson.startDate"
              @update:model-value="startDateMenu = false; updatePerson()"
            ></v-date-picker>
          </v-menu>
        </v-col>

        <v-col cols="12" sm="12" md="3" lg="3">
          <v-menu
            v-model="endDateMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                v-bind="props"
                v-model="formattedEndDate"
                label="End Date"
                hide-details="auto"
                readonly
                @click="endDateMenu = true"
                density="comfortable"
                variant="outlined"
              >
                <template v-slot:append-inner>
                    <v-btn
                    icon
                    variant="text"
                    title="Set to start of current month"
                    >
                    <v-icon>mdi-calendar-end</v-icon>
                    </v-btn>
                </template>
            </v-text-field>
            </template>
            <v-date-picker
              v-model="localPerson.endDate"
              @update:model-value="endDateMenu = false; updatePerson()"
            ></v-date-picker>
          </v-menu>
        </v-col>
        
        <v-col cols="12" sm="12" md="3" lg="3">
          <div class="text-body-1 text-center">Occupancy: {{ localPerson.days }} days</div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, ref, computed, watch } from 'vue'
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
    const startDateMenu = ref(false)
    const endDateMenu = ref(false)
    
    const formattedStartDate = computed(() => {
      return localPerson.startDate ? new Date(localPerson.startDate).toLocaleDateString() : '';
    });
    
    const formattedEndDate = computed(() => {
      return localPerson.endDate ? new Date(localPerson.endDate).toLocaleDateString() : '';
    });

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
      startDateMenu,
      endDateMenu,
      formattedStartDate,
      formattedEndDate
    }
  },
})
</script>

<style scoped>
</style>
