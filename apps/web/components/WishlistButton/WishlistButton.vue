<template>
  <UiButton
    variant="tertiary"
    size="sm"
    :aria-label="
      isWishlistItem(variationId)
        ? t('removeProductFromWishlist', { label: productName })
        : t('addProductToWishlist', { label: productName })
    "
    :class="{ 'p-[0.5rem]': !isCloseButton }"
    class="m-2"
    :disabled="wishlistLoading"
    data-testid="wishlist-trigger"
    @click="onWishlistClick"
  >
    <SfLoaderCircular v-if="actionLoading" class="flex justify-center items-center" size="sm" />
    <template v-else>
      <SfIconClose v-if="isCloseButton" size="sm" />
      <SfIconFavoriteFilled v-else-if="isWishlistItem(variationId) && isTrulyInWishlist" size="sm" />
      <SfIconFavorite v-else size="sm" />

      <slot />
    </template>
  </UiButton>
</template>

<script setup lang="ts">
import type { WishlistButtonProps } from '~/components/WishlistButton/types';
import { SfIconFavorite, SfIconFavoriteFilled, SfLoaderCircular, SfIconClose } from '@storefront-ui/vue';
import { productGetters } from '@plentymarkets/shop-api';

const { product, quantity = 1, discard = false, isTrulyInWishlist = false } = defineProps<WishlistButtonProps>();
const { t } = useI18n();
const { isWishlistItem, interactWithWishlist, loading: wishlistLoading } = useWishlist();
const actionLoading = ref(false);

const productName = computed(() => productGetters.getName(product));
const variationId = computed(() => productGetters.getVariationId(product));
const isCloseButton = computed(() => isWishlistItem(variationId.value) && discard);
const onWishlistClick = async () => {
  actionLoading.value = true;
  await interactWithWishlist(variationId.value, quantity, isTrulyInWishlist);
  actionLoading.value = false;
};
</script>
