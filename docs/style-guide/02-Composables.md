# Composables

## Naming conventions

[Vue guide](https://vuejs.org/guide/reusability/composables#naming)

## Scope

Every composable should do one thing well. This approach eliminates overhead and complexity within the composable. For example, prefer to create one composable to manage state and additional composables for different actions.

```
composables/
|_ useCustomer/
  |_ useCustomer.ts
|_ useCustomerCreate/
  |_ useCustomerCreate.ts
|_ useCustomerDelete/
  |_ useCustomerDelete.ts
```

## Side effects

[Vue guide](https://vuejs.org/guide/reusability/composables#side-effects)
