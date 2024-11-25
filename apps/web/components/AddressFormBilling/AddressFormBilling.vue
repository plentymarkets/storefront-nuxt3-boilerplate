<template>
  <form
    @submit="submitForm"
    novalidate
    class="grid grid-cols-1 md:grid-cols-[50%_1fr_120px] gap-4"
    data-testid="shipping-address-form"
  >
    <label>
      <UiFormLabel>
        {{ hasCompany ? $t('form.firstNameLabel') : `${$t('form.firstNameLabel')} ${$t('form.required')}` }}
      </UiFormLabel>
      <SfInput
        name="firstName"
        autocomplete="given-name"
        v-model="firstName"
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
        autocomplete="family-name"
        v-model="lastName"
        v-bind="lastNameAttributes"
        :invalid="Boolean(errors['lastName'])"
      />
      <ErrorMessage as="span" name="lastName" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <div class="md:col-span-3">
      <SfLink @click="hasCompany = !hasCompany" class="select-none hover:cursor-pointer">
        {{ !hasCompany ? $t('form.addCompany') : $t('form.removeCompany') }}
      </SfLink>
    </div>

    <label v-if="hasCompany">
      <UiFormLabel>{{ $t('form.companyLabel') }} {{ $t('form.required') }}</UiFormLabel>
      <SfInput
        name="companyName"
        autocomplete="company"
        v-model="companyName"
        v-bind="companyNameAttributes"
        :invalid="Boolean(errors['companyName'])"
      />
      <ErrorMessage as="span" name="companyName" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <label v-if="hasCompany" class="md:col-span-2">
      <UiFormLabel>{{ $t('form.vatIdLabel') }} {{ $t('form.required') }}</UiFormLabel>
      <SfInput
        autocomplete="vatNumber"
        v-model="vatNumber"
        v-bind="vatNumberAttributes"
        :invalid="Boolean(errors['vatNumber'])"
      />
      <ErrorMessage as="span" name="vatNumber" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <label class="md:col-span-2">
      <UiFormLabel>{{ $t('form.streetNameLabel') }} {{ $t('form.required') }}</UiFormLabel>
      <SfInput
        name="streetName"
        autocomplete="address-line1"
        v-model="streetName"
        v-bind="streetNameAttributes"
        :invalid="Boolean(errors['streetName'])"
      />
      <ErrorMessage as="span" name="streetName" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <label>
      <UiFormLabel>{{ $t('form.streetNumberLabel') }} {{ $t('form.required') }}</UiFormLabel>
      <SfInput
        name="streetNumber"
        autocomplete="address-line2"
        v-model="apartment"
        v-bind="apartmentAttributes"
        :invalid="Boolean(errors['apartment'])"
      />
      <ErrorMessage as="span" name="apartment" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <label>
      <UiFormLabel>{{ $t('form.postalCodeLabel') }} {{ $t('form.required') }}</UiFormLabel>
      <SfInput
        autocomplete="postal-code"
        v-model="zipCode"
        v-bind="zipCodeAttributes"
        :invalid="Boolean(errors['zipCode'])"
      />
      <ErrorMessage as="span" name="zipCode" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <label class="md:col-span-2">
      <UiFormLabel>{{ $t('form.cityLabel') }} {{ $t('form.required') }}</UiFormLabel>
      <SfInput
        name="city"
        autocomplete="address-level2"
        v-model="city"
        v-bind="cityAttributes"
        :invalid="Boolean(errors['city'])"
      />
      <ErrorMessage as="span" name="city" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <label class="md:col-span-3">
      <UiFormLabel>{{ $t('form.countryLabel') }} {{ $t('form.required') }}</UiFormLabel>
      <SfSelect
        name="country"
        v-model="country"
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
  </form>
</template>

<script setup lang="ts">
import { SfInput, SfSelect, SfLink } from '@storefront-ui/vue';
import { useForm, ErrorMessage } from 'vee-validate';
import { type AddressFormProps } from './types';
import { type Address, AddressType, userAddressGetters } from '@plentymarkets/shop-api';

const { address, addAddress = false } = defineProps<AddressFormProps>();

const { isGuest } = useCustomer();
const { shippingAsBilling } = useShippingAsBilling();
const { hasCompany, addressToSave, save: saveAddress, validationSchema } = useAddressForm(AddressType.Billing);
const { addresses: billingAddresses } = useAddressStore(AddressType.Billing);
const { set: setCheckoutAddress } = useCheckoutAddress(AddressType.Billing);
const { defineField, errors, setValues, validate, handleSubmit } = useForm({ validationSchema: validationSchema });
const { billingCountries } = useAggregatedCountries();

const [firstName, firstNameAttributes] = defineField('firstName');
const [lastName, lastNameAttributes] = defineField('lastName');
const [country, countryAttributes] = defineField('country');
const [streetName, streetNameAttributes] = defineField('streetName');
const [apartment, apartmentAttributes] = defineField('apartment');
const [city, cityAttributes] = defineField('city');
const [zipCode, zipCodeAttributes] = defineField('zipCode');
const [companyName, companyNameAttributes] = defineField('companyName');
const [vatNumber, vatNumberAttributes] = defineField('vatNumber');

if (!addAddress) {
  hasCompany.value = Boolean(userAddressGetters.getCompanyName(address as Address));
  setValues(address as any);
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

defineExpose({ validate, submitForm });
</script>
