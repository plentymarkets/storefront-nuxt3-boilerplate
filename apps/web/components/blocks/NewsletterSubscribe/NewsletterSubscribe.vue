<template>
  <div
    class="relative mt-5 p-4 sm:p-10 text-center"
    :style="{ backgroundColor: props.content.text?.bgColor ?? '#f5f5f5' }"
    data-testid="newsletter-block"
  >
    <h1
      v-if="props.index === 0"
      class="typography-display-3 md:typography-display-2 lg:typography-display-1 font-bold my-2 lg:leading-[4rem]"
      data-testid="newsletter-title"
      v-html="props.content.text?.title ?? t('newsletter.heading')"
    />
    <h2
      v-if="props.index !== 0"
      class="typography-headline-4 sm:typography-headline-3 font-bold mb-2"
      data-testid="newsletter-title"
      v-html="props.content.text?.title ?? t('newsletter.heading')"
    />
    <p
      class="typography-text-sm sm:typography-text-base my-2 mb-4"
      data-testid="newsletter-description"
      v-html="props.content.text?.htmlDescription ?? t('newsletter.info')"
    />

    <form class="mx-auto max-w-[550px] pt-2" novalidate @submit.prevent="onSubmit">
      <div
        v-if="props.content.input?.displayNameInput"
        class="grid grid-cols-1 sm:grid-cols-2"
        data-testid="newsletter-display-name"
      >
        <div class="sm:mr-[1rem]">
          <label for="newsletter-first-name">
            <UiFormLabel class="text-start">{{ t('newsletter.firstName') }}</UiFormLabel>
            <SfInput
              v-bind="firstNameAttributes"
              id="newsletter-first-name"
              v-model="firstName"
              :invalid="Boolean(errors['firstName'])"
              :placeholder="`${t('newsletter.firstName')} ${props.content.input?.nameIsRequired ? '**' : ''}`"
              :wrapper-class="wrapperClass"
              type="text"
              name="firstName"
            />
          </label>
          <div class="h-[2rem]">
            <ErrorMessage as="div" name="firstName" class="text-negative-700 text-left text-sm pt-[0.2rem]" />
          </div>
        </div>

        <div class="sm:ml-[1rem]">
          <label for="newsletter-last-name">
            <UiFormLabel class="text-start">{{ t('newsletter.lastName') }}</UiFormLabel>
            <SfInput
              v-bind="lastNameAttributes"
              id="newsletter-last-name"
              v-model="lastName"
              :invalid="Boolean(errors['lastName'])"
              :placeholder="`${t('newsletter.lastName')} ${props.content.input?.nameIsRequired ? '**' : ''}`"
              :wrapper-class="wrapperClass"
              type="text"
              name="lastName"
            />
          </label>
          <div class="h-[2rem]">
            <ErrorMessage as="div" name="lastName" class="text-negative-700 text-left text-sm pt-[0.2rem]" />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1">
        <label for="newsletter-email">
          <UiFormLabel class="text-start">{{ t('newsletter.email') }}</UiFormLabel>
          <SfInput
            v-bind="emailAttributes"
            id="newsletter-email"
            v-model="email"
            :invalid="Boolean(errors['email'])"
            :placeholder="`${t('newsletter.email')} **`"
            :wrapper-class="wrapperClass"
            type="email"
            name="email"
            autocomplete="email"
          />
        </label>
        <div class="h-[2rem]">
          <ErrorMessage as="div" name="email" class="text-negative-700 text-left text-sm pt-[0.2rem]" />
        </div>
      </div>

      <div class="text-base text-neutral-900">
        <div class="flex justify-center items-center">
          <SfCheckbox
            v-bind="privacyPolicyAttributes"
            id="terms-checkbox"
            v-model="privacyPolicy"
            :invalid="Boolean(errors['privacyPolicy'])"
            class="inline-block mr-2"
            data-testid="checkout-terms-checkbox"
          />
          <label for="terms-checkbox" class="text-left leading-5 select-none">
            <i18n-t keypath="newsletter.policy" scope="global">
              <template #privacyPolicy>
                <SfLink
                  :href="localePath(paths.privacyPolicy)"
                  target="_blank"
                  class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
                >
                  {{ t('privacyPolicy') }}
                </SfLink>
              </template>
            </i18n-t>
            **
          </label>
        </div>
        <div class="h-[2rem]">
          <ErrorMessage as="div" name="privacyPolicy" class="text-negative-700 text-left text-sm pt-[0.2rem]" />
        </div>
      </div>

      <div class="flex flex-col items-center">
        <UiButton type="submit" size="lg" :disabled="loading" data-testid="newsletter-button">
          <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="base" />
          <template v-else>{{ props.content.button?.label ?? t('newsletter.subscribe') }}</template>
        </UiButton>

        <NuxtTurnstile
          v-if="turnstileSiteKey"
          v-bind="turnstileAttributes"
          ref="turnstileElement"
          v-model="turnstile"
          :options="{ theme: 'light' }"
          class="mt-4"
        />

        <ErrorMessage as="div" name="turnstile" class="text-negative-700 text-left text-sm pt-[0.2rem]" />
      </div>
    </form>

    <div class="text-left typography-text-xs mt-3">** {{ t('contact.form.asterixHint') }}</div>
  </div>
</template>

<script lang="ts" setup>
import { SfCheckbox, SfInput, SfLink, SfLoaderCircular } from '@storefront-ui/vue';
import { useForm, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string, boolean } from 'yup';
import { paths } from '~/utils/paths';
import type { NewsletterSubscribeProps } from './types';

const runtimeConfig = useRuntimeConfig();
const { subscribe, loading } = useNewsletter();
const { send } = useNotification();
const localePath = useLocalePath();
const { t } = useI18n();
const props = defineProps<NewsletterSubscribeProps>();

const turnstileSiteKey = runtimeConfig.public?.turnstileSiteKey ?? '';
const turnstileElement = ref();
const wrapperClass = 'focus-within:outline focus-within:outline-offset';

const validationSchema = toTypedSchema(
  object({
    firstName: props.content.input?.nameIsRequired
      ? string().required(t('errorMessages.newsletter.firstNameRequired')).default('')
      : string().optional().default(''),
    lastName: props.content.input?.nameIsRequired
      ? string().required(t('errorMessages.newsletter.lastNameRequired')).default('')
      : string().optional().default(''),
    email: string().email(t('errorMessages.email.valid')).required(t('errorMessages.email.required')).default(''),
    privacyPolicy: boolean().oneOf([true], t('errorMessages.newsletter.termsRequired')).default(false),
    turnstile:
      turnstileSiteKey.length > 0
        ? string().required(t('errorMessages.newsletter.turnstileRequired')).default('')
        : string().optional().default(''),
  }),
);

const { errors, meta, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: validationSchema,
});

const [firstName, firstNameAttributes] = defineField('firstName');
const [lastName, lastNameAttributes] = defineField('lastName');
const [email, emailAttributes] = defineField('email');
const [turnstile, turnstileAttributes] = defineField('turnstile');
const [privacyPolicy, privacyPolicyAttributes] = defineField('privacyPolicy');

const subscribeNewsletter = async () => {
  if (!meta.value.valid || !turnstile.value) {
    return;
  }

  const response = await subscribe({
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value || '',
    emailFolder: 1,
    'cf-turnstile-response': turnstile.value,
  });

  if (response) {
    send({
      type: 'positive',
      message: t('newsletter.success'),
    });
    resetForm();
  }

  turnstile.value = '';
  turnstileElement.value?.reset();
};

const onSubmit = handleSubmit(() => subscribeNewsletter());
</script>
