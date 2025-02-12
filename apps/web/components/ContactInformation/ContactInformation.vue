<template>
  <div data-testid="contact-information" class="py-6">
    <div class="flex justify-between items-center my-2">
      <h2 class="text-neutral-900 text-lg font-bold">{{ $t('contactInfo.heading') }}</h2>
    </div>

    <ContactInformationForm ref="contactinformationForm" />
  </div>
</template>

<script lang="ts" setup>
import { useDisclosure } from '@storefront-ui/vue';
import type { ContactInformationProps } from './types';

const contactInformationForm = ref(null as any);
const { disabled = false } = defineProps<ContactInformationProps>();

const viewport = useViewport();
const { data: sessionData, loginAsGuest, getSession, isAuthorized } = useCustomer();
const { isOpen, open, close } = useDisclosure();
const cart = ref({ customerEmail: sessionData.value?.user?.email ?? sessionData.value?.user?.guestMail ?? '' });
const isMobile = computed(() => viewport.isLessThan('md'));

const saveContactInformation = async (email: string) => {
  cart.value.customerEmail = email;
  await loginAsGuest(email);
  await getSession();
  close();
};

watch(
  () => sessionData.value?.user,
  (userData) => {
    cart.value.customerEmail = userData?.email ?? userData?.guestMail ?? '';
    cart.value.customerEmail ? close() : open();
  },
  { immediate: true },
);



defineExpose({ contactInformationForm })

</script>
