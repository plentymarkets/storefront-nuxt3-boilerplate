import type {
  RegisterParams,
  SessionResult,
  UserChangePasswordParams,
  WishlistVariation,
  ApiError
} from '@plentymarkets/shop-api';
import type {
  UseCustomerReturn,
  UseCustomerState,
  GetSession,
  LoginAsGuest,
  Login,
  Register,
  Logout,
  ChangePassword,
} from '~/composables/useCustomer/types';

/**
 * @description Composable managing Customer data
 * @returns UseCustomerReturn
 * @example
 * ``` ts
 * const {
 * data, loading, isAuthorized, isGuest, privacyPolicy, setUser, getSession, login, logout, register, loginAsGuest,
 * setPrivacyPolicy, changePassword } = useCustomer();
 * ```
 */
export const useCustomer: UseCustomerReturn = () => {
  const state = useState<UseCustomerState>(`useCustomer`, () => ({
    data: {} as SessionResult,
    loading: false,
    isAuthorized: false,
    isGuest: false,
  }));

  /** Function for checking if user is guest or authorized
   * @example
   * ``` ts
   * checkUserState();
   * ```
   */
  const checkUserState = () => {
    if (state.value.data?.user?.guestMail) {
      state.value.isGuest = true;
      state.value.isAuthorized = false;
      return;
    }

    if (state.value.data?.user?.email) {
      state.value.isGuest = false;
      state.value.isAuthorized = true;
      return;
    }

    state.value.isGuest = false;
    state.value.isAuthorized = false;
  };

  /** Function for getting current user/cart data from session
   * @example
   * ``` ts
   * getSession();
   * ```
   */
  const getSession: GetSession = async () => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.getSession());
    useHandleError(error.value);
    state.value.data = data?.value?.data ?? state.value.data;
    checkUserState();
    useWishlist().setWishlistItemIds(Object.keys(state.value.data?.basket?.itemWishListIds || ({} as WishlistVariation)));

    state.value.loading = false;
    return state.value.data;
  };

  /** Function for setting user data
   * @param data { SessionResult }
   * @example
   * ``` ts
   * setUser(data: SessionResult);
   * ```
   */
  const setUser = (data: SessionResult) => {
    state.value.data = data;
    checkUserState();
  };

  /** Function for login a user as guest
   * @param email
   * @return LoginAsGuest
   * @example
   * ``` ts
   * loginAsGuest('user@example.com');
   * ```
   */
  const loginAsGuest: LoginAsGuest = async (email: string) => {
    state.value.loading = true;

    const { error } = await useAsyncData(() => useSdk().plentysystems.doLoginAsGuest({ email: email }));
    useHandleError(error.value);
    checkUserState();

    state.value.loading = false;
  };

  /** Function for user login.
   * @param email
   * @param password
   * @return Login
   * @example
   * ``` ts
   * login('user@example.com', 'password');
   * ```
   */
  const login: Login = async (email: string, password: string) => {
    state.value.loading = true;

    try {
      await useSdk()
        .plentysystems.doLogin({ email: email, password: password })
        .then(async () => await getSession());

      return state.value.isAuthorized;
    } catch (error) {
      useHandleError(error as ApiError);
      state.value.loading = false;
      return false;
    }
  };

  /** Function for user logout.
   * @return Logout
   * @example
   * ``` ts
   * logout();
   * ```
   */
  const logout: Logout = async () => {
    state.value.loading = true;

    const { error } = await useAsyncData(() => useSdk().plentysystems.doLogoutUser());
    state.value.loading = false;
    useHandleError(error.value);

    state.value.data.user = null;
    checkUserState();
    useWishlist().setWishlistItemIds({} as WishlistVariation);
  };

  /** Function for registering a user.
   * @param params { RegisterParams }
   * @return Register
   * @example
   * ``` ts
   * register({ email: 'example', password: 'example', 'cf-turnstile-response': '' });
   * ```
   */
  const register: Register = async (params: RegisterParams) => {
    state.value.loading = true;

    const { data, error } = await useAsyncData(() => useSdk().plentysystems.doRegisterUser(params));

    useHandleError(error.value);
    state.value.loading = false;

    if (data.value) {
      await getSession();
    }

    return data.value?.data ?? null;
  };

  /** Function for changing the user password
   * @param params { UserChangePasswordParams }
   * @return ChangePassword
   * @example
   * ``` ts
   * changePassword({
   *   oldPassword: 'oldPassword',
   *   password: 'newPassword',
   *   password2: 'newPassword',
   * });
   * ```
   */
  const changePassword: ChangePassword = async (params: UserChangePasswordParams) => {
    state.value.loading = true;

    const { error } = await useAsyncData(() => useSdk().plentysystems.doChangeUserPassword(params));
    state.value.loading = false;
    useHandleError(error.value);

    return !error.value;
  };

  return {
    setUser,
    getSession,
    login,
    logout,
    register,
    loginAsGuest,
    changePassword,
    showNetPrices: state?.value?.data?.user?.showNetPrices,
    ...toRefs(state.value),
  };
};
