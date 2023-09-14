<template>
  <p>
    {{ address.name1 }}
    {{ address.name2 }}
    {{ address.name3 }}
    {{ address.name4 }}
  </p>
  <p>
    {{ address.address1 }}
    {{ address.address2 }}
    {{ address.address3 }}
    {{ address.address4 }}
    {{ address.postalCode }}
  </p>
  <p>{{ address.town + ', ' + country }}</p>
</template>

<script setup lang="ts">
import { OrderAddressDataPropsType } from './types';

const { data: countries } = useActiveShippingCountries();
const props = defineProps<OrderAddressDataPropsType>();
const country = computed(() => {
  return countries.value.find((country) => country.id === props.address.countryId)?.name ?? '';
});
</script>
