<template>
  <form
    @submit="submitForm"
    novalidate
    class="grid grid-cols-1 md:grid-cols-[50%_1fr_120px] gap-4"
    data-testid="shipping-address-form"
  >
    <label>
      <UiFormLabel>
        {{ hasShippingCompany ? $t('form.firstNameLabel') : `${$t('form.firstNameLabel')} ${$t('form.required')}` }}
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
        {{ hasShippingCompany ? $t('form.lastNameLabel') : `${$t('form.lastNameLabel')} ${$t('form.required')}` }}
      </UiFormLabel>
      <SfInput
        name="lastName"
        autocomplete="family-name"
        v-model="lastName"
        v-bind="lastNameAttributes"
        :invalid="Boolean(errors['lastName'])"
      />
      <ErrorMessage as="span" name="lastName" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <div class="md:col-span-3">
      <SfLink @click="hasShippingCompany = !hasShippingCompany" class="select-none hover:cursor-pointer">
        {{ !hasShippingCompany ? $t('form.addCompany') : $t('form.removeCompany') }}
      </SfLink>
    </div>

    <label v-if="hasShippingCompany">
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

    <label v-if="hasShippingCompany" class="md:col-span-2">
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
        name="zipCode"
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
          v-for="(shippingCountry, index) in shippingCountries"
          :key="`shipping-country-${index}`"
          :value="shippingCountry.id.toString()"
        >
          {{ shippingCountry.currLangName }}
        </option>
      </SfSelect>
      <ErrorMessage as="span" name="country" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <label v-if="!restrictedAddresses" class="flex items-center gap-2">
      <SfCheckbox data-testid="use-shipping-as-billing" v-model="shippingAsBilling" />
      <span class="cursor-pointer select-none">{{ $t('form.useAsBillingLabel') }}</span>
    </label>
  </form>
</template>

<script setup lang="ts">
import { SfInput, SfSelect, SfLink, SfCheckbox } from '@storefront-ui/vue';
import { useForm, ErrorMessage } from 'vee-validate';
import { type AddressFormProps } from './types';
import { type Address, AddressType, userAddressGetters } from '@plentymarkets/shop-api';

const { address, addAddress = false } = defineProps<AddressFormProps>();

const { isGuest } = useCustomer();
const { default: shippingCountries } = useAggregatedCountries();
const { shippingAsBilling } = useShippingAsBilling();
const { handleCartTotalChanges } = useCartTotalChange();
const { addresses: shippingAddresses } = useAddressStore(AddressType.Shipping);
const { addresses: billingAddresses } = useAddressStore(AddressType.Billing);
const { set: setShippingAddress } = useCheckoutAddress(AddressType.Shipping);
const { set: setBillingAddress } = useCheckoutAddress(AddressType.Billing);
const { addressToSave: billingAddressToSave, save: saveBillingAddress } = useAddressForm(AddressType.Billing);
const { restrictedAddresses } = useRestrictedAddress();
const {
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

if (!addAddress) {
  hasShippingCompany.value = Boolean(userAddressGetters.getCompanyName(address as Address));
  setValues(address as any);
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

defineExpose({ validate, submitForm });
</script>
