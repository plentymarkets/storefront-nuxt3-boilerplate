<template>
  <div class="my-5">
    <UiButton> My Modules Test button</UiButton>
  </div>
</template>
<script setup lang="ts">

if (import.meta.client) {
  try {
    const { data: cart } = useCart();
    console.log('cart', cart.value);
    
  } catch (error) {
    console.error(error);
  }
}
</script>
