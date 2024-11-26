import { addComponentsDir, addImportsDir, createResolver, defineNuxtModule, addPlugin } from "@nuxt/kit";

export default defineNuxtModule({
    meta: {
        name: "paypal",
        configKey: "paypal"
    },
    setup(options, nuxt) {
        const resolver = createResolver(import.meta.url);

        addComponentsDir(({
            path: resolver.resolve("components"),
        }));
        addImportsDir(resolver.resolve('composables'));
        addPlugin(resolver.resolve('plugins/registerComponents.ts'));
    }
});