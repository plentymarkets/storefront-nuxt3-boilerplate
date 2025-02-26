<template>
  <form
    novalidate
    class="grid grid-cols-1 md:grid-cols-[50%_1fr_120px] gap-4"
    data-testid="shipping-address-form"
    @submit.prevent="validateAndSubmitForm"
  >
    <label>
      <UiFormLabel>
        {{ hasCompany ? $t('form.firstNameLabel') : `${$t('form.firstNameLabel')} ${$t('form.required')}` }}
      </UiFormLabel>
      <SfInput
        v-model="firstName"
        name="firstName"
        autocomplete="given-name"
        v-bind="firstNameAttributes"
        :invalid="Boolean(errors['firstName'])"
      />
      <ErrorMessage as="span" name="firstName" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <label class="md:col-span-2">
      <UiFormLabel>
        {{ hasCompany ? $t('form.lastNameLabel') : `${$t('form.lastNameLabel')} ${$t('form.required')}` }}
      </UiFormLabel>
      <SfInput
        v-model="lastName"
        autocomplete="family-name"
        v-bind="lastNameAttributes"
        :invalid="Boolean(errors['lastName'])"
      />
      <ErrorMessage as="span" name="lastName" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <div class="md:col-span-3">
      <SfLink class="select-none hover:cursor-pointer" @click="hasCompany = !hasCompany">
        {{ !hasCompany ? $t('form.addCompany') : $t('form.removeCompany') }}
      </SfLink>
    </div>

    <label v-if="hasCompany">
      <UiFormLabel>{{ $t('form.companyLabel') }} {{ $t('form.required') }}</UiFormLabel>
      <SfInput
        v-model="companyName"
        name="companyName"
        autocomplete="company"
        v-bind="companyNameAttributes"
        :invalid="Boolean(errors['companyName'])"
      />
      <ErrorMessage as="span" name="companyName" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <label v-if="hasCompany" class="md:col-span-2">
      <UiFormLabel>{{ $t('form.vatIdLabel') }} {{ $t('form.required') }}</UiFormLabel>
      <SfInput
        v-model="vatNumber"
        autocomplete="vatNumber"
        v-bind="vatNumberAttributes"
        :invalid="Boolean(errors['vatNumber'])"
      />
      <ErrorMessage as="span" name="vatNumber" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <label class="md:col-span-2">
      <UiFormLabel>{{ $t('form.streetNameLabel') }} {{ $t('form.required') }}</UiFormLabel>
      <SfInput
        v-model="streetName"
        name="streetName"
        autocomplete="address-line1"
        v-bind="streetNameAttributes"
        :invalid="Boolean(errors['streetName'])"
      />
      <ErrorMessage as="span" name="streetName" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <label>
      <UiFormLabel>{{ $t('form.streetNumberLabel') }} {{ $t('form.required') }}</UiFormLabel>
      <SfInput
        v-model="apartment"
        name="streetNumber"
        autocomplete="address-line2"
        v-bind="apartmentAttributes"
        :invalid="Boolean(errors['apartment'])"
      />
      <ErrorMessage as="span" name="apartment" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <label>
      <UiFormLabel>{{ $t('form.postalCodeLabel') }} {{ $t('form.required') }}</UiFormLabel>
      <SfInput
        v-model="zipCode"
        autocomplete="postal-code"
        v-bind="zipCodeAttributes"
        :invalid="Boolean(errors['zipCode'])"
      />
      <ErrorMessage as="span" name="zipCode" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <label class="md:col-span-2">
      <UiFormLabel>{{ $t('form.cityLabel') }} {{ $t('form.required') }}</UiFormLabel>
      <SfInput
        v-model="city"
        name="city"
        autocomplete="address-level2"
        v-bind="cityAttributes"
        :invalid="Boolean(errors['city'])"
      />
      <ErrorMessage as="span" name="city" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <label class="md:col-span-3">
      <UiFormLabel>{{ $t('form.countryLabel') }} {{ $t('form.required') }}</UiFormLabel>
      <SfSelect
        v-model="country"
        name="country"
        v-bind="countryAttributes"
        :placeholder="$t('form.selectPlaceholder')"
        :invalid="Boolean(errors['country'])"
        wrapper-class-name="bg-white"
        class="!ring-1 !ring-neutral-200"
        autocomplete="country-name"
      >
        <option
          v-for="(billingCountry, index) in billingCountries"
          :key="`billing-country-${index}`"
          :value="billingCountry.id.toString()"
        >
          {{ billingCountry.currLangName }}
        </option>
      </SfSelect>
      <ErrorMessage as="span" name="country" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <div
      v-if="!restrictedAddresses || showAddressSaveButton"
      class="md:col-span-3 flex flex-col sm:flex-row sm:justify-end sm:items-center"
    >
      <div v-if="showAddressSaveButton" class="flex items-center">
        <UiButton
          :data-testid="`save-address-${AddressType.Billing}`"
          :disabled="formIsLoading"
          variant="secondary"
          type="submit"
        >
          {{ $t('saveAddress') }}
        </UiButton>

        <UiButton
          v-if="hasCheckoutAddress"
          :disabled="formIsLoading || disabled"
          variant="secondary"
          class="ml-2"
          :data-testid="`close-address-${AddressType.Billing}`"
          @click="edit"
        >
          <SfIconClose />
        </UiButton>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { type Address, AddressType, userAddressGetters } from '@plentymarkets/shop-api';
import { SfIconClose, SfInput, SfLink, SfSelect } from '@storefront-ui/vue';
import { ErrorMessage, useForm } from 'vee-validate';
import type { AddressFormBillingProps } from './types';

const { disabled, address, addAddress = false } = defineProps<AddressFormBillingProps>();

const { isGuest, validGuestEmail } = useCustomer();
const { shippingAsBilling } = useShippingAsBilling();
const {
  isLoading: formIsLoading,
  hasCompany,
  addressToSave,
  open: editing,
  addressToEdit,
  add: showNewForm,
  save: saveAddress,
  validationSchema: billingSchema,
} = useAddressForm(AddressType.Billing);
const { addresses: billingAddresses } = useAddressStore(AddressType.Billing);
const { set: setCheckoutAddress, hasCheckoutAddress } = useCheckoutAddress(AddressType.Billing);
const { defineField, errors, setValues, validate, handleSubmit } = useForm({ validationSchema: billingSchema });
const { billingCountries } = useAggregatedCountries();
const { restrictedAddresses } = useRestrictedAddress();

const [firstName, firstNameAttributes] = defineField('firstName');
const [lastName, lastNameAttributes] = defineField('lastName');
const [country, countryAttributes] = defineField('country');
const [streetName, streetNameAttributes] = defineField('streetName');
const [apartment, apartmentAttributes] = defineField('apartment');
const [city, cityAttributes] = defineField('city');
const [zipCode, zipCodeAttributes] = defineField('zipCode');
const [companyName, companyNameAttributes] = defineField('companyName');
const [vatNumber, vatNumberAttributes] = defineField('vatNumber');

const showAddressSaveButton = computed(() => editing.value || showNewForm.value);

if (!addAddress && address) {
  hasCompany.value = Boolean(userAddressGetters.getCompanyName(address as Address));
  setValues(address as unknown as Record<string, string>);

  if (!hasCompany.value) {
    companyName.value = '';
    vatNumber.value = '';
  }
}

const guestHasShippingAsBilling = isGuest.value && shippingAsBilling.value;

const syncCheckoutAddress = async () => {
  await setCheckoutAddress(
    addAddress || guestHasShippingAsBilling
      ? (billingAddresses.value[0] as Address)
      : (userAddressGetters.getDefault(billingAddresses.value) as Address),
    !addAddress,
  );

  if (guestHasShippingAsBilling) shippingAsBilling.value = false;
};

const validateAndSubmitForm = async () => {
  const formData = await validate();

  if (formIsLoading.value || (isGuest.value && !validGuestEmail.value)) return;

  if (formData.valid) {
    await submitForm();
    if (showNewForm.value) showNewForm.value = false;
  }
};

const submitForm = handleSubmit((billingAddressForm) => {
  addressToSave.value = billingAddressForm as Address;

  if (guestHasShippingAsBilling && !addAddress) delete addressToSave.value?.id;
  if (addAddress) addressToSave.value.primary = true;
  if (!hasCompany.value) {
    addressToSave.value.companyName = '';
    addressToSave.value.vatNumber = '';
  }

  saveAddress()
    .then(() => syncCheckoutAddress())
    .catch((error) => useHandleError(error));
});

const edit = (address: Address) => {
  if (disabled) return;
  addressToEdit.value = editing.value || showNewForm.value ? ({} as Address) : address;
  editing.value = !(editing.value || showNewForm.value);
  showNewForm.value = false;
};
</script>
