<template>
  <form
    ref="formRef"
    class="grid grid-cols-1 md:grid-cols-[50%_1fr_120px] gap-4"
    data-testid="address-form"
    @submit.prevent="$emit('on-save', defaultValues, useAsShippingAddress)"
  >
    <label>
      <UiFormLabel>{{ $t('form.firstNameLabel') }} {{ $t('form.required') }}</UiFormLabel>
      <SfInput name="firstName" autocomplete="given-name" v-model="defaultValues.firstName" required />
    </label>
    <label class="md:col-span-2">
      <UiFormLabel>{{ $t('form.lastNameLabel') }} {{ $t('form.required') }}</UiFormLabel>
      <SfInput name="lastName" autocomplete="family-name" v-model="defaultValues.lastName" required />
    </label>

    <ClientOnly>
      <SfLink
        href="#"
        class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded md:col-span-3 mb-2"
        @click.prevent="changeHasCompany()"
      >
        <span v-if="!hasCompany">{{ $t('newCheckout.addCompanyData') }}</span>
        <span v-else>{{ $t('newCheckout.removeCompanyData') }}</span>
      </SfLink>
    </ClientOnly>
    <div v-if="hasCompany" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
      <label class="md:col-span-1">
        <UiFormLabel class="flex">
          <span class="mr-1">{{ $t('newCheckout.companyName') }} {{ $t('form.required') }}</span>
        </UiFormLabel>
        <SfInput name="companyName" type="text" v-model="defaultValues.name1" />
      </label>
      <label class="md:col-span-1">
        <UiFormLabel class="flex">
          <span class="mr-1">{{ $t('newCheckout.vatid') }} {{ $t('form.required') }}</span>
        </UiFormLabel>
        <SfInput name="vatId" type="text" v-model="defaultValues.vatNumber" />
      </label>
    </div>

    <label class="md:col-span-3">
      <UiFormLabel class="flex">
        <span class="mr-1">{{ $t('form.phoneLabel') }}</span>
        <UiFormHelperText>({{ $t('form.optional') }})</UiFormHelperText>
      </UiFormLabel>
      <SfInput
        name="phone"
        type="tel"
        minlength="7"
        maxlength="18"
        autocomplete="tel"
        v-model="defaultValues.phoneNumber"
      />
    </label>
    <label class="md:col-span-3">
      <UiFormLabel>{{ $t('form.countryLabel') }} {{ $t('form.required') }}</UiFormLabel>
      <SfSelect
        name="country"
        v-model="defaultValues.country"
        @change="defaultValues.state = ''"
        :placeholder="$t('form.selectPlaceholder')"
        autocomplete="country-name"
        required
      >
        <option v-for="(country, index) in countries" :key="index" :value="country.id.toString()">
          {{ country.name }}
        </option>
      </SfSelect>
    </label>
    <label class="md:col-span-2">
      <UiFormLabel>{{ $t('form.streetNameLabel') }} {{ $t('form.required') }}</UiFormLabel>
      <SfInput name="streetName" autocomplete="address-line1" v-model="defaultValues.streetName" required />
    </label>
    <label>
      <UiFormLabel>{{ $t('form.streetNumberLabel') }} {{ $t('form.required') }}</UiFormLabel>
      <SfInput name="streetNumber" v-model="defaultValues.apartment" required />
    </label>
    <label class="md:col-span-3">
      <UiFormLabel>{{ $t('form.cityLabel') }} {{ $t('form.required') }}</UiFormLabel>
      <SfInput name="city" autocomplete="address-level2" v-model="defaultValues.city" required />
    </label>
    <label class="md:col-span-2" v-if="states.length > 0">
      <UiFormLabel class="flex">
        <span class="mr-1">{{ $t('form.stateLabel') }}</span>
        <UiFormHelperText>({{ $t('form.optional') }})</UiFormHelperText>
      </UiFormLabel>
      <SfSelect
        v-model="defaultValues.state"
        name="state"
        autocomplete="address-level1"
        :placeholder="$t('form.selectPlaceholder')"
      >
        <option v-for="(state, index) in states" :key="index" :value="state.id.toString()">{{ state.name }}</option>
      </SfSelect>
    </label>
    <label>
      <UiFormLabel>{{ $t('form.postalCodeLabel') }} {{ $t('form.required') }}</UiFormLabel>
      <SfInput name="postalCode" autocomplete="postal-code" v-model="defaultValues.zipCode" required />
    </label>

    <label v-if="type === AddressType.Billing" class="md:col-span-3 flex items-center gap-2">
      <SfCheckbox name="useAsShipping" v-model="useAsShippingAddress" />
      {{ $t('form.useAsShippingLabel') }}
    </label>

    <div class="md:col-span-3 flex flex-col-reverse md:flex-row justify-end mt-6 gap-4">
      <SfButton
        type="button"
        class="max-md:w-1/2"
        variant="secondary"
        :disabled="isCartUpdateLoading"
        @click="clearInputs"
      >
        {{ $t('contactInfo.clearAll') }}
      </SfButton>
      <SfButton data-testid="save-address" type="submit" class="min-w-[120px]" :disabled="isCartUpdateLoading">
        <SfLoaderCircular v-if="isCartUpdateLoading" class="flex justify-center items-center" size="sm" />
        <span v-else>
          {{ $t('contactInfo.save') }}
        </span>
      </SfButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { type Address, AddressType, userAddressGetters } from '@plentymarkets/shop-api';
import { SfButton, SfCheckbox, SfInput, SfLink, SfLoaderCircular, SfSelect } from '@storefront-ui/vue';
import type { AddressFormProps } from '~/components/AddressForm/types';
const { loading: loadBilling, useAsShippingAddress } = useAddress(AddressType.Billing);
const { loading: loadShipping } = useAddress(AddressType.Shipping);
const props = withDefaults(defineProps<AddressFormProps>(), {});

const isCartUpdateLoading = computed(() => loadBilling.value || loadShipping.value);

const savedAddress = props.savedAddress || ({} as Address);

const hasCompany = ref(false);
if (userAddressGetters.getCompanyName(savedAddress) || userAddressGetters.getTaxNumber(savedAddress)) {
  hasCompany.value = true;
}

const defaultValues = ref({
  firstName: userAddressGetters.getFirstName(savedAddress),
  lastName: userAddressGetters.getLastName(savedAddress),
  phoneNumber: userAddressGetters.getPhone(savedAddress),
  country: savedAddress?.country ?? '',
  streetName: userAddressGetters.getStreetName(savedAddress),
  apartment: userAddressGetters.getStreetNumber(savedAddress),
  city: userAddressGetters.getCity(savedAddress),
  state: userAddressGetters.getProvince(savedAddress),
  zipCode: userAddressGetters.getPostCode(savedAddress),
  primary: !userAddressGetters.getId(savedAddress),
  name1: userAddressGetters.getCompanyName(savedAddress),
  vatNumber: userAddressGetters.getTaxNumber(savedAddress),
});

const clearInputs = () => {
  defaultValues.value = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    country: '',
    streetName: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    primary: !userAddressGetters.getId(savedAddress),
    name1: '',
    vatNumber: '',
  };
};

const changeHasCompany = () => {
  hasCompany.value = !hasCompany.value;
  defaultValues.value = { ...defaultValues.value, name1: '', vatNumber: '' };
};

const states = computed(() => {
  const selectedCountry = defaultValues.value.country;
  return props.countries.find((country) => country.id === Number(selectedCountry))?.states ?? [];
});

const emit = defineEmits(['on-save', 'on-close']);
const emitFormValues = () => {
  emit('on-save', defaultValues.value, useAsShippingAddress.value);
};
defineExpose({ emitFormValues });
</script>
