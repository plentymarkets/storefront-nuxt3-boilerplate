# Components

## ui components

`components/ui` should contain two types of components:

1. **Base components**: Base components should be general-purpose components that may be re-used throughout the application. Each base component has a directory, for example `components/ui/Button/Button.vue`.
2. **Single instance components**: Single instance components should only be used once on a page. In general this means they're part of a layout. Each single instance component is at the root of the `ui` directory, for example `components/ui/Header.vue`.

Create all other components outside the `ui` directory.

## Skeletons (Client-Side Rendering)

> **NOTE** that we prefer Server-Side Rendering whenever possible. We only consider Client-Side Rendering if external circumstances make SSR unviable. For example, CSR shouldn't be used to cover up hydration errors or problems in state management.

Select edge cases require us to render a component on the client side. For this, we use the `ClientOnly` component provided by [Nuxt](https://nuxt.com/docs/api/components/client-only). The `ClientOnly` component has a slot for a fallback. This slot should contain a skeleton of the component.

Create Skeleton components inside the corresponding component directory. The name should be the same as the component itself with `Skeleton` as suffix, for example `components/SliderContentSkeleton.vue`.
