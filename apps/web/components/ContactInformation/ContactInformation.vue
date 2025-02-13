<template>
  <div data-testid="contact-information" class="py-6">
    <div class="flex justify-between items-center my-2">
      <h2 class="text-neutral-900 text-lg font-bold">{{ $t('contactInfo.heading') }}</h2>
    </div>
    <p v-if="cart.customerEmail && !sessionData.user?.guestMail" class="mt-4 md:w-[520px]">{{ cart.customerEmail }}</p>
    <form v-else data-testid="contact-information-form" novalidate>
      <label>
        <UiFormLabel>{{ t('contactInfo.email') }} {{ $t('form.required') }}</UiFormLabel>
        <SfInput
          v-model="customerEmail" autofocus v-bind="customerEmailAttributes"
          :invalid="Boolean(errors['cart.customerEmail'])"
          name="customerEmail" type="email" autocomplete="email" @blur="onLeaveInput" />
        <ErrorMessage as="span" name="cart.customerEmail" class="flex text-negative-700 text-sm mt-2" />
      </label>
    </form>
  </div>
</template>


<script lang="ts" setup>
import { SfInput } from '@storefront-ui/vue';

import { useForm, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string } from 'yup';

const { data: sessionData, loginAsGuest } = useCustomer();

const cart = ref({ customerEmail: sessionData.value?.user?.email ?? sessionData.value?.user?.guestMail ?? '' });

const { t } = useI18n();

const validationSchema = toTypedSchema(
  object({
    cart: object({
      customerEmail: string()
        .email(t('errorMessages.email.valid'))
        .required(t('errorMessages.email.required'))
        .default(''),
    }),
  }),
);

const { errors, meta, defineField, validate } = useForm({
  validationSchema: validationSchema,
});

const [customerEmail, customerEmailAttributes] = defineField('cart.customerEmail');


const onLeaveInput = () => {
  submitForm();
}

const submitForm = async () => {
  if (meta.value.valid && customerEmail.value) {
    return loginAsGuest(customerEmail.value);
  }

  return false;
}

watch(
  () => sessionData.value?.user,
  (userData) => {
    cart.value.customerEmail = userData?.email ?? userData?.guestMail ?? '';
    customerEmail.value = cart.value.customerEmail ?? '';
  },
  { immediate: true },
);

defineExpose({ meta, validate, submitForm });
</script>
