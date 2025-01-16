import type {
  useStructuredDataReturn,
  SetLogoMeta,
  SetProductMetaData,
  SetProductRobotsMetaData,
  SetProductCanonicalMetaData,
  UseStructuredDataState,
} from './types';
import { categoryTreeGetters, productGetters, reviewGetters, productSeoSettingsGetters } from '@plentymarkets/shop-api';
import type { CategoryTreeItem, Product, CanonicalAlternate, StructuredReview } from '@plentymarkets/shop-api';
import { useProductReviews } from '../useProductReviews';

/**
 * @description Composable managing meta data
 * @returns useStructuredDataReturn
 * @example
 * ``` ts
 * const { data, loading, setLogoMeta, setStaticPageMeta } = useMeta();
 * ```
 */
export const useStructuredData: useStructuredDataReturn = () => {
  const state = useState<UseStructuredDataState>(`useMeta`, () => ({
    loading: false,
  }));

  /**
   * @description Function for Setting Logo Metadata.
   * @returns SetLogoMeta
   * @example
   * ``` ts
   * setLogoMeta()
   * ```
   */
  const setLogoMeta: SetLogoMeta = () => {
    state.value.loading = true;

    const runtimeConfig = useRuntimeConfig();
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      url: runtimeConfig.public.domain,
      logo: runtimeConfig.public.domain + '/images/logo.png',
    };
    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(structuredData),
        },
      ],
    });

    state.value.loading = false;
  };

  /**
   * @description Function for Setting Single Item Meta
   * @example
   * ``` ts
   * setSingleItemMeta({
   *  product: Product,
   *  categoryTree: CategoryTreeItem
   * })
   * ```
   */
  const setProductMetaData: SetProductMetaData = (product: Product, categoryTree: CategoryTreeItem) => {
    state.value.loading = true;
    const { price, crossedPrice } = useProductPrice(product);
    const productId = Number(productGetters.getItemId(product));

    const { data: productReviews } = useProductReviews(productId);

    const structuredReviews: StructuredReview[] = [];
    reviewGetters.getReviewItems(productReviews.value).forEach((reviewItem) => {
      structuredReviews.push({
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: reviewGetters.getReviewRating(reviewItem),
        },
        author: {
          '@type': 'Person',
          name: reviewGetters.getReviewAuthor(reviewItem),
        },
      });
    });
    const metaObject = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: productGetters.getName(product),
      category: categoryTreeGetters.getName(categoryTree),
      releaseDate: '',
      image: productGetters.getCoverImage(product),
      identifier: productGetters.getId(product),
      description: product.texts.description,
      disambiguatingDescription: '',
      review: structuredReviews,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: productGetters.getAverageRating(product),
        reviewCount: productGetters.getTotalReviews(product),
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: productGetters.getSpecialPriceCurrency(product),
        price: Number(price.value),
        url: null,
        priceSpecification: [
          {
            '@type': 'UnitPriceSpecification',
            price: Number(price.value),
            priceCurrency: productGetters.getSpecialPriceCurrency(product),
            priceType: 'SalePrice',
            referenceQuantity: {
              '@type': 'QuantitativeValue',
            },
          },
        ],
        availability: productSeoSettingsGetters.getMappedAvailability(product),
        itemCondition: productSeoSettingsGetters.getConditionOfItem(product),
      },
      depth: {
        '@type': 'QuantitativeValue',
        value: productGetters.getLengthMM(product),
      },
      width: {
        '@type': 'QuantitativeValue',
        value: productGetters.getWidthMM(product),
      },
      height: {
        '@type': 'QuantitativeValue',
        value: productGetters.getHeightMM(product),
      },
      weight: {
        '@type': 'QuantitativeValue',
        value: productGetters.getWeightG(product),
      },
    } as any;

    const manufacturer = productSeoSettingsGetters.getSeoManufacturer(product);
    if (manufacturer !== '') metaObject.manufacturer = { '@type': 'Organization', name: manufacturer };

    const brand = productSeoSettingsGetters.getBrand(product);
    if (brand !== '') metaObject.brand = { '@type': 'Brand', name: brand };

    const sku = productSeoSettingsGetters.getSku(product);
    if (sku !== '') metaObject.sku = sku;

    const gtin = productSeoSettingsGetters.getGtin(product);
    if (gtin !== '') metaObject.gtin = gtin;

    const gtin8 = productSeoSettingsGetters.getGtin8(product);
    if (gtin8 !== '') metaObject.gtin8 = gtin8;

    const gtin13 = productSeoSettingsGetters.getGtin13(product);
    if (gtin13 !== '') metaObject.gtin13 = gtin13;

    const isbn = productSeoSettingsGetters.getIsbn(product);
    if (isbn !== '') metaObject.isbn = productSeoSettingsGetters.getIsbn(product);

    const mpn = productSeoSettingsGetters.getMpn(product);
    if (mpn !== '') metaObject.mpn = mpn;

    const priceValidUntil = productSeoSettingsGetters.getPriceValidUntil(product);
    if (priceValidUntil !== '') metaObject.offers.priceValidUntil = priceValidUntil;

    if (product.prices?.rrp) {
      metaObject.offers.priceSpecification.push({
        '@type': 'UnitPriceSpecification',
        price: Number(crossedPrice.value),
        priceCurrency: productGetters.getRegularPriceCurrency(product),
        priceType: 'ListPrice',
        referenceQuantity: {
          '@type': 'QuantitativeValue',
        },
      });
    }
    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(metaObject, null, 4),
        },
      ],
    });
    state.value.loading = false;
  };

  const setProductRobotsMetaData: SetProductRobotsMetaData = (product: Product) => {
    state.value.loading = true;

    const route = useRoute();
    let robotsContent = product.seoSettings?.robots || '';

    if (
      (!product.seoSettings?.forceRobotsValue && Object.keys(route.query).length > 0) ||
      product.seoSettings?.forceNoIndex
    ) {
      robotsContent = 'noindex';
    }

    useHead({
      meta: [{ name: 'robots', content: robotsContent }],
    });

    state.value.loading = false;
  };

  const setProductCanonicalMetaData: SetProductCanonicalMetaData = (product: Product) => {
    state.value.loading = true;

    const canonical = productSeoSettingsGetters.getCanonical(product);

    if (canonical) {
      useHead({
        link: [{ rel: 'canonical', href: productSeoSettingsGetters.getCanonicalHref(canonical) }],
      });

      const canonicalAlternates = productSeoSettingsGetters.getCanonicalAlternate(canonical);
      const alternateLocales = canonicalAlternates.map((item: CanonicalAlternate) => {
        return {
          rel: 'alternate',
          hreflang: productSeoSettingsGetters.getCanonicalAlternateHreflang(item),
          href: productSeoSettingsGetters.getCanonicalAlternateHref(item),
        };
      });

      useHead({
        link: alternateLocales,
      });
    }
    state.value.loading = false;
  };

  return {
    setLogoMeta,
    setProductMetaData,
    setProductRobotsMetaData,
    setProductCanonicalMetaData,
    ...toRefs(state.value),
  };
};
