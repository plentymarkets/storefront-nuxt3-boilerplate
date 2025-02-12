<template>
  <form data-testid="contact-information-form" novalidate>
    <label>
      <UiFormLabel>{{ t('contactInfo.email') }} {{ $t('form.required') }}</UiFormLabel>
      <SfInput v-model="customerEmail" autofocus v-bind="customerEmailAttributes"
        :invalid="Boolean(errors['cart.customerEmail'])" name="customerEmail" type="email" autocomplete="email" />
      <ErrorMessage as="span" name="cart.customerEmail" class="flex text-negative-700 text-sm mt-2" />
    </label>
  </form>
</template>

<script setup lang="ts">
import { SfInput } from '@storefront-ui/vue';
import { useForm, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string } from 'yup';

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

const { setMail } = useCustomer();

const [customerEmail, customerEmailAttributes] = defineField('cart.customerEmail');
watch(customerEmail, ((email) => {
   if (email) {
     setMail(email);
   }
}));

defineExpose({ customerEmail, meta, validate });

</script>
