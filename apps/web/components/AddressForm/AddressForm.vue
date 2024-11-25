<template>
  <form
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
        wrapper-class-name="bg-white"
        class="!ring-1 !ring-neutral-200"
        autocomplete="country-name"
        required
      >
        <option v-for="(country, index) in countries" :key="index" :value="country.id.toString()">
          {{ country.currLangName }}
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
        :placeholder="$t('form.selectPlaceholder')"
        name="state"
        autocomplete="address-level1"
        wrapper-class-name="bg-white"
        class="!ring-1 !ring-neutral-200"
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
      <UiButton
        type="button"
        class="max-md:w-1/2"
        variant="secondary"
        :disabled="isCartUpdateLoading"
        @click="clearInputs"
      >
        {{ $t('contactInfo.clearAll') }}
      </UiButton>
      <UiButton data-testid="save-address" type="submit" class="min-w-[120px]" :disabled="isCartUpdateLoading">
        <SfLoaderCircular v-if="isCartUpdateLoading" class="flex justify-center items-center" size="sm" />
        <span v-else>
          {{ $t('contactInfo.save') }}
        </span>
      </UiButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import {
  type ActiveShippingCountry,
  type Address,
  AddressType,
  type GeoRegulatedCountry,
  userAddressGetters,
} from '@plentymarkets/shop-api';
import { SfCheckbox, SfInput, SfLoaderCircular, SfSelect } from '@storefront-ui/vue';
import { type AddressFormProps } from '~/components/AddressForm/types';

const { type, savedAddress: propertySavedAddress, useAsShippingDefault = true } = defineProps<AddressFormProps>();

const { loading: loadBilling } = useAddress(AddressType.Billing);
const { loading: loadShipping } = useAddress(AddressType.Shipping);
const { billingCountries, default: defaultCountries } = useAggregatedCountries();

const countries = computed(() => (type === AddressType.Billing ? billingCountries.value : defaultCountries.value));
const isCartUpdateLoading = computed(() => loadBilling.value || loadShipping.value);
const useAsShippingAddress = ref(useAsShippingDefault);
const savedAddress = propertySavedAddress || ({} as Address);

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
  };
};

const states = computed(() => {
  const selectedCountry = defaultValues.value.country;
  return (
    countries.value.find(
      (country: ActiveShippingCountry | GeoRegulatedCountry) => country.id === Number(selectedCountry),
    )?.states ?? []
  );
});

defineEmits(['on-save', 'on-close']);
</script>
