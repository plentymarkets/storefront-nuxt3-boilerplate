import type {
  RegisterParams,
  SessionResult,
  UserChangePasswordParams,
  UserChangeResponse,
} from '@plentymarkets/shop-api';
import type { toTypedSchema } from '@vee-validate/yup';

export interface UseCustomerState {
  data: SessionResult;
  loading: boolean;
  isAuthorized: boolean;
  isGuest: boolean;
  validGuestEmail: boolean;
}

export type GetSession = () => Promise<SessionResult>;

export type ChangePassword = (params: UserChangePasswordParams) => Promise<boolean>;
export type LoginAsGuest = (email: string) => Promise<void>;
export type Login = (email: string, password: string) => Promise<boolean>;
export type Logout = () => Promise<void>;
export type Register = (params: RegisterParams) => Promise<UserChangeResponse | null>;
export type SetUser = (data: SessionResult) => void;

export interface UseCustomer {
  data: Readonly<Ref<UseCustomerState['data']>>;
  isAuthorized: Readonly<Ref<UseCustomerState['isAuthorized']>>;
  isGuest: Readonly<Ref<UseCustomerState['isGuest']>>;
  validGuestEmail: Ref<boolean>;

  loading: Readonly<Ref<boolean>>;
  setUser: SetUser;
  getSession: GetSession;
  login: Login;
  logout: Logout;
  register: Register;
  loginAsGuest: LoginAsGuest;
  changePassword: ChangePassword;
  emailValidationSchema: ReturnType<typeof toTypedSchema>;
  backToContactInformation: () => boolean;
  showNetPrices?: boolean;
}

export type UseCustomerReturn = () => UseCustomer;
