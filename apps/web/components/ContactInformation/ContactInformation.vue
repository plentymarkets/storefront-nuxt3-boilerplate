<template>
  <div data-testid="contact-information" class="py-6">
    <div class="flex justify-between items-center my-2">
      <h2 class="text-neutral-900 text-lg font-bold">{{ $t('contactInfo.heading') }}</h2>
    </div>
    <form data-testid="contact-information-form" novalidate>
    <label>
      <UiFormLabel>{{ t('contactInfo.email') }} {{ $t('form.required') }}</UiFormLabel>
      <SfInput
        v-model="customerEmail" autofocus v-bind="customerEmailAttributes"
        @blur="onLeaveInput"
        :invalid="Boolean(errors['cart.customerEmail'])" name="customerEmail" type="email" autocomplete="email" />
      <ErrorMessage as="span" name="cart.customerEmail" class="flex text-negative-700 text-sm mt-2" />
    </label>
  </form>
  </div>
</template>


<script lang="ts" setup>
import { useDisclosure } from '@storefront-ui/vue';
import type { ContactInformationProps } from './types';

const { disabled = false } = defineProps<ContactInformationProps>();

const viewport = useViewport();
const { data: sessionData, loginAsGuest, getSession, isAuthorized } = useCustomer();
const { isOpen, open, close } = useDisclosure();
const cart = ref({ customerEmail: sessionData.value?.user?.email ?? sessionData.value?.user?.guestMail ?? '' });
const isMobile = computed(() => viewport.isLessThan('md'));

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

const [customerEmail, customerEmailAttributes] = defineField('cart.customerEmail');


const onLeaveInput = () => {
  submitForm();
}

const submitForm = async () => {
  const { loginAsGuest } = useCustomer();

  if (meta.value.valid && customerEmail.value) {
    return loginAsGuest(customerEmail.value);
  }

  return false;
}

watch(
  () => sessionData.value?.user,
  (userData) => {
    cart.value.customerEmail = userData?.email ?? userData?.guestMail ?? '';
    cart.value.customerEmail ? close() : open();
  },
  { immediate: true },
);

defineExpose({ meta, validate, submitForm });
</script>
