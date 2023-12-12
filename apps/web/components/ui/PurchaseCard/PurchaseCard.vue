<template>
  <section
    class="p-4 xl:p-6 md:border md:border-neutral-100 md:shadow-lg md:rounded-md md:sticky md:top-40"
    data-testid="purchase-card"
  >
    <h1 class="mb-1 font-bold typography-headline-4" data-testid="product-name">
      {{ productGetters.getName(product) }}
    </h1>
    <Price :price="currentActualPrice" :old-price="productGetters.getPrice(product).regular ?? 0" />
    <LowestPrice :product="product" />
    <div v-if="productGetters.showPricePerUnit(product)">
      <BasePrice
        :base-price="basePriceSingleValue"
        :unit-content="productGetters.getUnitContent(product)"
        :unit-name="productGetters.getUnitName(product)"
      />
    </div>
    <div class="inline-flex items-center mt-4 mb-2">
      <SfRating size="xs" :value="reviewGetters.getAverageRating(reviewAverage)" :max="5" />
      <SfCounter class="ml-1" size="xs">{{ reviewGetters.getTotalReviews(reviewAverage) }}</SfCounter>
      <SfLink variant="secondary" @click="scrollToReviews" class="ml-2 text-xs text-neutral-500 cursor-pointer">
        {{ $t('showAllReviews') }}
      </SfLink>
    </div>
    <div
      class="mb-4 font-normal typography-text-sm"
      data-testid="product-description"
      v-html="productGetters.getShortDescription(product)"
    ></div>

    <OrderProperties v-if="product" :product="product" />

    <div class="mb-2">
      <AttributeSelect v-if="product" :product="product" />
    </div>
    <GraduatedPriceList v-if="product" :product="product" :count="quantitySelectorValue" />
    <div class="py-4">
      <div class="flex flex-col md:flex-row flex-wrap gap-4">
        <UiQuantitySelector
          :value="quantitySelectorValue"
          @change-quantity="changeQuantity"
          class="min-w-[145px] flex-grow flex-shrink-0 basis-0"
        />
        <SfTooltip
          show-arrow
          placement="top"
          :label="isSalableText"
          class="flex-grow-[2] flex-shrink basis-auto whitespace-nowrap"
        >
          <SfButton
            data-testid="add-to-cart"
            size="lg"
            class="w-full"
            @click="handleAddToCart"
            :disabled="loading || !productGetters.isSalable(product)"
          >
            <template #prefix v-if="!loading">
              <SfIconShoppingCart size="sm" />
            </template>
            <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="sm" />
            <span v-else>
              {{ $t('addToCart') }}
            </span>
          </SfButton>
        </SfTooltip>
      </div>
      <div class="mt-4 typography-text-xs flex gap-1">
        <span>{{ $t('asterisk') }}</span>
        <span v-if="showNetPrices">{{ $t('itemExclVAT') }}</span>
        <span v-else>{{ $t('itemInclVAT') }}</span>
        <span>{{ $t('excludedShipping') }}</span>
      </div>
      <PayPalExpressButton
        class="mt-4"
        type="SingleItem"
        :value="{ product: product, quantity: quantitySelectorValue }"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { productGetters, reviewGetters } from '@plentymarkets/shop-sdk';
import {
  SfButton,
  SfCounter,
  SfLink,
  SfRating,
  SfIconShoppingCart,
  SfLoaderCircular,
  SfTooltip,
} from '@storefront-ui/vue';
import type { PurchaseCardProps } from '~/components/ui/PurchaseCard/types';

const runtimeConfig = useRuntimeConfig();
const showNetPrices = runtimeConfig.public.showNetPrices;

const props = defineProps<PurchaseCardProps>();

const { product } = toRefs(props);

const { send } = useNotification();
const { addToCart, loading } = useCart();
const { t } = useI18n();

const quantitySelectorValue = ref(1);
const currentActualPrice = computed(
  () =>
    productGetters.getGraduatedPriceByQuantity(product.value, quantitySelectorValue.value)?.price.value ??
    productGetters.getPrice(product.value)?.special ??
    productGetters.getPrice(product.value)?.regular ??
    0,
);
const basePriceSingleValue = computed(
  () =>
    productGetters.getGraduatedPriceByQuantity(product.value, quantitySelectorValue.value)?.baseSinglePrice ??
    productGetters.getDefaultBaseSinglePrice(product.value),
);

const test = [{
  propertyId: 27,
  type: 'empty',
  name: 'Order Properties - without markup/surcharge With option "Preselected" and "Required"',
  property: {
    value: true
  }
}];

const handleAddToCart = async () => {
  await addToCart({
    productId: Number(productGetters.getId(product.value)),
    quantity: Number(quantitySelectorValue.value),
    basketItemOrderParams: test
  });

  send({ message: t('addedToCart'), type: 'positive' });
};

const changeQuantity = (quantity: string) => {
  quantitySelectorValue.value = Number(quantity);
};

const isReviewsAccordionOpen = () => {
  const customerReviewsAccordionDetailsElement = document.querySelector('#customerReviewsAccordion')
    ?.firstChild as HTMLDetailsElement;

  return customerReviewsAccordionDetailsElement.open;
};

const openReviewsAccordion = () => {
  const customerReviewsClickElement = document.querySelector('#customerReviewsClick') as HTMLElement;
  customerReviewsClickElement?.click();
};

const scrollToReviewsAccordion = () => {
  const customerReviewsAccordionElement = document.querySelector('#customerReviewsAccordion') as HTMLElement;
  const customerReviewsAccordionElementOffset = customerReviewsAccordionElement?.offsetTop ?? 0;

  const headerElement = document.querySelector('header') as HTMLElement;
  const headerElementOffset = headerElement.offsetHeight ?? 0;

  window.scrollTo({
    top: customerReviewsAccordionElementOffset - headerElementOffset,
    behavior: 'smooth',
  });
};

const isSalableText = computed(() => (productGetters.isSalable(product.value) ? '' : t('itemNotAvailable')));

const scrollToReviews = () => {
  if (!isReviewsAccordionOpen()) {
    openReviewsAccordion();
  }

  scrollToReviewsAccordion();
};
</script>
