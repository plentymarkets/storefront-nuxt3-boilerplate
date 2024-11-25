<template>
  <div v-for="(group, groupIndex) in orderPropertiesGroups" :key="`group-${groupIndex}`" class="mt-5">
    <div class="font-semibold">
      {{ productPropertyGetters.getOrderPropertyGroupName(group) }}
    </div>

    <div class="font-normal typography-text-sm mb-2">
      {{ productPropertyGetters.getOrderPropertyGroupDescription(group) }}
    </div>

    <div
      v-for="(productProperty, propIndex) in group.orderProperties"
      :key="`group-prop-${propIndex}`"
      class="mt-2 flex items-center"
    >
      <!-- ClientOnly until fixed: https://github.com/nuxt/nuxt/issues/23768#issuecomment-1849023053 -->
      <ClientOnly>
        <Component
          v-if="componentsMapper[productPropertyGetters.getOrderPropertyValueType(productProperty)]"
          :has-tooltip="hasTooltip"
          :product-property="productProperty"
          :is="componentsMapper[productPropertyGetters.getOrderPropertyValueType(productProperty)]"
        >
          <template v-if="productPropertyGetters.hasOrderPropertyDescription(productProperty)" #tooltip>
            <SfTooltip
              :label="productPropertyGetters.getOrderPropertyDescription(productProperty)"
              :placement="'bottom'"
              :show-arrow="true"
              class="ml-2 z-50"
            >
              <SfIconInfo :size="'sm'" />
            </SfTooltip>
          </template>
        </Component>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { productPropertyGetters } from '@plentymarkets/shop-api';
import type { ComponentsMapper, OrderPropertiesProps } from './types';
import OrderPropertyInput from '~/components/OrderPropertyInput/OrderPropertyInput.vue';
import OrderPropertySelect from '~/components/OrderPropertySelect/OrderPropertySelect.vue';
import OrderPropertyCheckbox from '~/components/OrderPropertyCheckbox/OrderPropertyCheckbox.vue';
import OrderPropertyFileUpload from '~/components/OrderPropertyFileUpload/OrderPropertyFileUpload.vue';
import { SfIconInfo, SfTooltip } from '@storefront-ui/vue';

const props = defineProps<OrderPropertiesProps>();
const product = props.product;
const orderPropertiesGroups = productPropertyGetters.getOrderPropertiesGroups(product);
const hasTooltip = productPropertyGetters.hasOrderPropertiesGroupsTooltips(orderPropertiesGroups);
const componentsMapper: ComponentsMapper = {
  empty: OrderPropertyCheckbox,
  int: OrderPropertyInput,
  text: OrderPropertyInput,
  float: OrderPropertyInput,
  selection: OrderPropertySelect,
  file: OrderPropertyFileUpload,
};
</script>
