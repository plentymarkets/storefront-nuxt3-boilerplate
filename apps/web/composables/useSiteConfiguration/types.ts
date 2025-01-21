type DrawerView = 'settings' | 'blocks' | null;

export interface UseSiteConfigurationState {
  data: [];
  loading: boolean;
  drawerOpen: boolean;
  drawerView: DrawerView;
}

export interface UseSiteConfiguration {
  data: Readonly<Ref<UseSiteConfigurationState['data']>>;
  loading: Readonly<Ref<boolean>>;
  drawerOpen: Readonly<Ref<UseSiteConfigurationState['drawerOpen']>>;
  drawerView: Readonly<Ref<UseSiteConfigurationState['drawerView']>>;
}

export type UseSiteConfigurationReturn = () => UseSiteConfiguration;
