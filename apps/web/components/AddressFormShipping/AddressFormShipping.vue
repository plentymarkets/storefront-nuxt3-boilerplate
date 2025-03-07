<template>
  <form
    novalidate
    class="grid grid-cols-1 md:grid-cols-[50%_1fr_120px] gap-4"
    data-testid="shipping-address-form"
    @submit.prevent="validateAndSubmitForm"
  >
    <label>
      <UiFormLabel>
        {{ hasShippingCompany ? $t('form.firstNameLabel') : `${$t('form.firstNameLabel')} ${$t('form.required')}` }}
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
        {{ hasShippingCompany ? $t('form.lastNameLabel') : `${$t('form.lastNameLabel')} ${$t('form.required')}` }}
      </UiFormLabel>
      <SfInput
        v-model="lastName"
        name="lastName"
        autocomplete="family-name"
        v-bind="lastNameAttributes"
        :invalid="Boolean(errors['lastName'])"
      />
      <ErrorMessage as="span" name="lastName" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <div class="md:col-span-3">
      <SfLink class="select-none hover:cursor-pointer" @click="hasShippingCompany = !hasShippingCompany">
        {{ !hasShippingCompany ? $t('form.addCompany') : $t('form.removeCompany') }}
      </SfLink>
    </div>

    <label v-if="hasShippingCompany">
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

    <label v-if="hasShippingCompany" class="md:col-span-2">
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
        name="zipCode"
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
          v-for="(shippingCountry, index) in shippingCountries"
          :key="`shipping-country-${index}`"
          :value="shippingCountry.id.toString()"
        >
          {{ shippingCountry.currLangName }}
        </option>
      </SfSelect>
      <ErrorMessage as="span" name="country" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <div
      v-if="!restrictedAddresses || showAddressSaveButton"
      class="md:col-span-3 flex flex-col sm:flex-row sm:justify-between sm:items-center"
    >
      <label v-if="!restrictedAddresses" class="flex items-center gap-2">
        <SfCheckbox v-model="shippingAsBilling" data-testid="use-shipping-as-billing" />
        <span class="cursor-pointer select-none">{{ $t('form.useAsBillingLabel') }}</span>
      </label>

      <div v-if="showAddressSaveButton" :class="{ 'mt-3 sm:mt-0': !restrictedAddresses }" class="flex items-center">
        <UiButton
          :data-testid="`save-address-${AddressType.Shipping}`"
          :disabled="formIsLoading"
          variant="secondary"
          type="submit"
        >
          {{ $t('saveAddress') }}
        </UiButton>

        <UiButton
          v-if="hasShippingAddress"
          :disabled="formIsLoading || disabled"
          variant="secondary"
          class="ml-2"
          :data-testid="`close-address-${AddressType.Shipping}`"
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
import { SfCheckbox, SfIconClose, SfInput, SfLink, SfSelect } from '@storefront-ui/vue';
import { ErrorMessage, useForm } from 'vee-validate';
import type { AddressFormShippingProps } from './types';

const { disabled, address, addAddress = false } = defineProps<AddressFormShippingProps>();

const { isGuest, validGuestEmail } = useCustomer();
const { default: shippingCountries } = useAggregatedCountries();
const { shippingAsBilling } = useShippingAsBilling();
const { handleCartTotalChanges } = useCartTotalChange();
const { addresses: shippingAddresses } = useAddressStore(AddressType.Shipping);
const { addresses: billingAddresses } = useAddressStore(AddressType.Billing);
const { set: setShippingAddress, hasCheckoutAddress: hasShippingAddress } = useCheckoutAddress(AddressType.Shipping);
const { set: setBillingAddress } = useCheckoutAddress(AddressType.Billing);
const { addressToSave: billingAddressToSave, save: saveBillingAddress } = useAddressForm(AddressType.Billing);
const { restrictedAddresses } = useRestrictedAddress();
const {
  isLoading: formIsLoading,
  add: showNewForm,
  open: editing,
  addressToEdit,
  hasCompany: hasShippingCompany,
  addressToSave: shippingAddressToSave,
  save: saveShippingAddress,
  validationSchema: shippingSchema,
  refreshAddressDependencies,
} = useAddressForm(AddressType.Shipping);
const { defineField, errors, setValues, validate, handleSubmit } = useForm({ validationSchema: shippingSchema });

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
  hasShippingCompany.value = Boolean(userAddressGetters.getCompanyName(address as Address));
  setValues(address as unknown as Record<string, string>);

  if (!hasShippingCompany.value) {
    companyName.value = '';
    vatNumber.value = '';
  }
}

const handleSaveShippingAsBilling = async (shippingAddressForm: Address) => {
  if (!restrictedAddresses.value && shippingAsBilling.value) {
    billingAddressToSave.value = isGuest.value
      ? (shippingAddresses.value[0] as Address)
      : (shippingAddressForm as Address);

    if (addAddress) billingAddressToSave.value.primary = true;
    if (!hasShippingCompany.value) {
      billingAddressToSave.value.companyName = '';
      billingAddressToSave.value.vatNumber = '';
    }

    await saveBillingAddress();
  }
};

const handleShippingPrimaryAddress = async () => {
  if (shippingAddresses.value.length > 0) {
    await setShippingAddress(
      addAddress || isGuest.value
        ? (shippingAddresses.value[0] as Address)
        : (userAddressGetters.getDefault(shippingAddresses.value) as Address),
      !addAddress,
    );

    usePrimaryAddress(AddressType.Shipping).primaryAddressId.value =
      shippingAddresses.value?.find((item) => item.primary === true)?.id || -1;
  }
};

const handleBillingPrimaryAddress = async () => {
  if (!restrictedAddresses.value && shippingAsBilling.value && billingAddresses.value.length > 0) {
    await setBillingAddress(
      addAddress || isGuest.value
        ? (billingAddresses.value[0] as Address)
        : (userAddressGetters.getDefault(billingAddresses.value) as Address),
      false,
    );

    usePrimaryAddress(AddressType.Billing).primaryAddressId.value =
      billingAddresses.value?.find((item) => item.primary === true)?.id || -1;
  }
};

const validateAndSubmitForm = async () => {
  const formData = await validate();

  if (formIsLoading.value || (isGuest.value && !validGuestEmail.value)) return;

  if (formData.valid) {
    await submitForm();
    if (showNewForm.value) showNewForm.value = false;
  }
};

const submitForm = handleSubmit((shippingAddressForm) => {
  shippingAddressToSave.value = shippingAddressForm as Address;

  if (addAddress) shippingAddressToSave.value.primary = true;
  if (!hasShippingCompany.value) {
    shippingAddressToSave.value.companyName = '';
    shippingAddressToSave.value.vatNumber = '';
  }

  saveShippingAddress()
    .then(() => handleSaveShippingAsBilling(shippingAddressForm as Address))
    .then(() => handleShippingPrimaryAddress())
    .then(() => handleBillingPrimaryAddress())
    .then(() => refreshAddressDependencies())
    .then(() => handleCartTotalChanges())
    .catch((error) => useHandleError(error));
});

const edit = (address: Address) => {
  if (disabled) return;
  addressToEdit.value = editing.value || showNewForm.value ? ({} as Address) : address;
  editing.value = !(editing.value || showNewForm.value);
  showNewForm.value = false;
};
</script>
