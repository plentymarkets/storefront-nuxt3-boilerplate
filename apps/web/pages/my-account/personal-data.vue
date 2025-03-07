<template>
  <UiDivider class="col-span-3 -mx-4 !w-auto md:mx-0" />
  <h2
    class="hidden md:block col-span-3 typography-headline-4 font-bold mx-4 capitalize"
    data-testid="account-orders-heading"
  >
    {{ $t('account.accountSettings.section.personalData') }}
  </h2>
  <UiDivider class="col-span-3 -mx-4 !w-auto md:mx-0" />
  <AccountData
    class="col-span-3"
    :header="$t('account.accountSettings.personalData.yourName')"
    :button-text="$t('account.accountSettings.personalData.edit')"
    data-testid="account-name"
    @on-click="openModal('yourName')"
  >
    {{ userData?.user?.firstName }} {{ userData?.user?.lastName }}
  </AccountData>
  <UiDivider class="col-span-3 -mx-4 !w-auto md:mx-0" />
  <AccountData
    class="col-span-3"
    :header="$t('account.accountSettings.personalData.contactInformation')"
    :button-text="$t('account.accountSettings.personalData.edit')"
    data-testid="account-email"
    @on-click="openModal('contactInformation')"
  >
    {{ userData?.user?.email }}
  </AccountData>
  <UiDivider class="col-span-3 -mx-4 !w-auto md:mx-0" />
  <AccountData
    class="col-span-3"
    :header="$t('account.accountSettings.personalData.yourPassword')"
    :button-text="$t('account.accountSettings.personalData.change')"
    :show-edit-button="true"
    data-testid="account-password"
    @on-click="openModal('passwordChange')"
  >
    ******
  </AccountData>
  <UiDivider class="col-span-3 -mx-4 !w-auto md:mx-0" />
  <UiModal
    ref="modalElement"
    v-model="isOpen"
    tag="section"
    role="dialog"
    class="h-full w-full overflow-auto md:w-[600px] md:h-fit"
    aria-labelledby="address-modal-title"
  >
    <header>
      <UiButton type="button" square variant="tertiary" class="absolute right-2 top-2" @click="closeModal">
        <SfIconClose />
      </UiButton>
      <h3 id="address-modal-title" class="text-neutral-900 text-lg md:text-2xl font-bold mb-6">
        {{ $t(`account.accountSettings.personalData.${openedForm}`) }}
      </h3>
    </header>
    <AccountFormsName v-if="openedForm === 'yourName'" @on-save="closeModal" @on-cancel="closeModal" />
    <AccountFormsPassword v-else-if="openedForm === 'passwordChange'" @on-save="closeModal" @on-cancel="closeModal" />
  </UiModal>
</template>

<script setup lang="ts">
import { SfIconClose, useDisclosure } from '@storefront-ui/vue';
import { unrefElement } from '@vueuse/core';

definePageMeta({
  layout: 'account',
  pageType: 'static',
  middleware: ['auth-guard'],
});
const { isOpen, open, close } = useDisclosure();
const lastActiveElement = ref();
const modalElement = ref();
const openedForm = ref('');
const openModal = async (modalName: string) => {
  openedForm.value = modalName;
  lastActiveElement.value = document.activeElement;
  open();
  await nextTick();
  unrefElement(modalElement).focus();
};

const closeModal = () => {
  close();
  lastActiveElement.value.focus();
};

const { data: userData } = useCustomer();
</script>
