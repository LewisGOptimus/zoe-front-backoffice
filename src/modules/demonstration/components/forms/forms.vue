<template>
  <form class="space-y-4" novalidate @submit.prevent="handleSubmit">
    <InputText
      id="demonstration-name"
      :model-value="form.name"
      name="name"
      type="text"
      label="Nombre"
      placeholder="Nombre del contacto"
      required
      :error="errors.name"
      @update:model-value="onNameChange"
    />

    <InputText
      id="demonstration-email"
      v-model="form.email"
      name="email"
      type="email"
      label="Email"
      placeholder="correo@empresa.com"
      required
      :error="errors.email"
    />

    <InputText
      id="demonstration-phone"
      :model-value="form.phone"
      name="phone"
      type="tel"
      label="Teléfono"
      placeholder="3000000000"
      required
      input-class="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      :error="errors.phone"
      @update:model-value="onPhoneChange"
    />

    <div class="grid gap-4 sm:grid-cols-2">
      <Datepicker
        id="demonstration-date"
        v-model="form.scheduledDate"
        label="Fecha programada"
        mode="single"
        full-width
        required
      />
      <InputText
        id="demonstration-time"
        v-model="form.scheduledTime"
        name="scheduledTime"
        type="time"
        label="Hora"
        required
        :error="errors.scheduledTime"
      />
    </div>
    <p v-if="errors.scheduledDate" class="text-xs text-red-500 -mt-2">
      {{ errors.scheduledDate }}
    </p>

    <InputSelect
      id="demonstration-product"
      v-model="form.productInterest"
      name="productInterest"
      label="Producto de interés"
      placeholder="Seleccionar producto"
      required
      :options="productOptions"
      :error="errors.productInterest"
    />

    <InputSelect
      v-if="mode === 'edit'"
      id="demonstration-status"
      v-model="form.status"
      name="status"
      label="Estado"
      placeholder="Seleccionar estado"
      required
      :options="statusOptions"
      :error="errors.status"
    />

  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

import Datepicker from '~/core/ui/form/Datepicker.vue'
import InputSelect from '~/core/ui/inputs/InputSelect.vue'
import InputText from '~/core/ui/inputs/InputText.vue'
import type { InputSelectOption } from '~/core/ui/inputs/input.types'
import type { Demonstration, DemonstrationResponse, UpdateDemonstration } from '../../types/demonstration.types'
import { DemonstrationStatus } from '../../types/demonstration.types'
import {
  emptyDemonstrationFormErrors,
  mapDemonstrationResponseToFormValues,
  parseDemonstrationForm,
  parseDemonstrationUpdateForm,
  sanitizeDemonstrationName,
  sanitizeDemonstrationPhone,
  type DemonstrationFormErrors,
} from '../../schema/demonstrations.schema'

defineOptions({
  name: 'FormDemonstration',
})

const props = withDefaults(defineProps<{
  mode?: 'create' | 'edit'
}>(), {
  mode: 'create',
})

const emit = defineEmits<{
  submit: [payload: Demonstration | UpdateDemonstration]
}>()

const productOptions: InputSelectOption[] = [
  { label: 'Contabilidad', value: 'Contabilidad' },
  { label: 'Factura Electronica', value: 'Factura Electronica' },
  { label: 'Administrativo de Escritorio', value: 'Administrativo de Escritorio' },
]

const statusOptions: InputSelectOption[] = [
  { label: 'Pendiente', value: DemonstrationStatus.PENDIENTE },
  { label: 'Ejecutada', value: DemonstrationStatus.EJECUTADA },
  { label: 'Cancelada', value: DemonstrationStatus.CANCELADA },
]

const initialForm = () => ({
  name: '',
  email: '',
  phone: '',
  scheduledDate: null as string | Date | Date[] | null,
  scheduledTime: '',
  productInterest: '',
  status: '' as DemonstrationStatus | '',
})

const form = reactive(initialForm())

const errors = reactive<DemonstrationFormErrors>(emptyDemonstrationFormErrors())

const onNameChange = (value: string) => {
  form.name = sanitizeDemonstrationName(value)
  errors.name = ''
}

const onPhoneChange = (value: string) => {
  form.phone = sanitizeDemonstrationPhone(value)
  errors.phone = ''
}

const reset = () => {
  Object.assign(form, initialForm())
  Object.assign(errors, emptyDemonstrationFormErrors())
}

const setValues = (demonstration: DemonstrationResponse) => {
  Object.assign(form, mapDemonstrationResponseToFormValues(demonstration))
  Object.assign(errors, emptyDemonstrationFormErrors())
}


const handleSubmit = () => {
  if (props.mode === 'edit') {
    const result = parseDemonstrationUpdateForm({
      name: form.name,
      email: form.email,
      phone: form.phone,
      scheduledDate: form.scheduledDate,
      scheduledTime: form.scheduledTime,
      productInterest: form.productInterest,
      status: form.status,
    })

    if (!result.success) {
      Object.assign(errors, result.errors)
      return
    }

    Object.assign(errors, emptyDemonstrationFormErrors())
    emit('submit', result.data)
    return
  }

  const result = parseDemonstrationForm({ ...form })

  if (!result.success) {
    Object.assign(errors, result.errors)
    return
  }

  Object.assign(errors, emptyDemonstrationFormErrors())
  emit('submit', result.data)
}

defineExpose({
  submit: handleSubmit,
  reset,
  setValues,
})
</script>
