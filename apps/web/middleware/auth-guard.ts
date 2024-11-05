/**
 * This middleware is used to check if the user is authorized.
 *
 * Use this auth guard to protect routes that require the user to be logged in.
 *
 * If the user is not authorized, the user will be redirected to the login page.
 */

export default defineNuxtRouteMiddleware(async () => {
  const { isAuthorized, getSession } = useCustomer();
  const localePath = useLocalePath();
  
  await getSession();

  if (!isAuthorized.value) {
    return navigateTo(localePath(paths.authLogin));
  }
});
