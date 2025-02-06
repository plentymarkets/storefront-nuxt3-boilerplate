import type { TailwindPalette } from '~/utils/tailwindHelper';
export type DrawerView = 'settings' | 'blocksList' | 'blocksSettings' | null;
export type SelectedFont = { caption: string; value: string };
export type ConfigurationSettings = {
  blockSize: string;
  selectedFont: SelectedFont;
  primaryColor: string;
  secondaryColor: string;
};

export interface UseSiteConfigurationState {
  data: [];
  loading: boolean;
  drawerOpen: boolean;
  newBlockPosition: number;
  currentFont: string;
  primaryColor: string;
  secondaryColor: string;
  selectedFont: SelectedFont;
  blockSize: string;
  placement: string;
  drawerView: DrawerView;
  blockType: string;
  blockIndex: number;
  initialData: ConfigurationSettings;
}

export type LoadGoogleFont = (font: string) => void;
export type UpdateBlockSize = (size: string) => void;
export type UpdateNewBlockPosition = (position: number) => void;
export type SetTailwindColorProperties = (type: string, tailwindPalette: TailwindPalette) => void;
export type SetColorPalette = (hexColor: string) => void;
export type OpenDrawerView = (view: DrawerView, type?: string, index?: number) => void;
export type SaveSettings = () => void;

export interface UseSiteConfiguration {
  data: Readonly<Ref<UseSiteConfigurationState['data']>>;
  loading: Readonly<Ref<boolean>>;
  drawerOpen: Readonly<Ref<UseSiteConfigurationState['drawerOpen']>>;
  blockType: Readonly<Ref<UseSiteConfigurationState['blockType']>>;
  blockIndex: Readonly<Ref<UseSiteConfigurationState['blockIndex']>>;
  newBlockPosition: Readonly<Ref<UseSiteConfigurationState['newBlockPosition']>>;
  currentFont: Readonly<Ref<UseSiteConfigurationState['currentFont']>>;
  primaryColor: Readonly<Ref<UseSiteConfigurationState['primaryColor']>>;
  secondaryColor: Readonly<Ref<UseSiteConfigurationState['secondaryColor']>>;
  blockSize: Readonly<Ref<UseSiteConfigurationState['blockSize']>>;
  placement: Readonly<Ref<UseSiteConfigurationState['placement']>>;
  drawerView: Readonly<Ref<UseSiteConfigurationState['drawerView']>>;
  selectedFont: Readonly<Ref<UseSiteConfigurationState['selectedFont']>>;
  initialData: Readonly<Ref<UseSiteConfigurationState['initialData']>>;
  updateNewBlockPosition: UpdateNewBlockPosition;
  loadGoogleFont: LoadGoogleFont;
  updatePrimaryColor: SetColorPalette;
  updateSecondaryColor: SetColorPalette;
  updateBlockSize: UpdateBlockSize;
  saveSettings: SaveSettings;
  openDrawerWithView: OpenDrawerView;
  closeDrawer: () => void;
  settingsIsDirty: ComputedRef<boolean>;
}

export type UseSiteConfigurationReturn = () => UseSiteConfiguration;
