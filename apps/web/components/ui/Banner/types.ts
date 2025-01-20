export type BannerProps = {
  image?: {
    desktop?: string;
    tablet?: string;
    mobile?: string;
    alt?: string;
    brightness?: number;
  };
  text?: {
    color?: string;
    bgcolor?: string;
    controlsColor?: string;
    bgopacity?: number;
    pretitle?: string;
    title?: string;
    subtitle?: string;
    htmlDescription?: string;
    textAlignment?: 'left' | 'center' | 'right';
    justify?: 'start' | 'center' | 'end';
    align?: 'start' | 'center' | 'end';
  };
  button?: {
    label?: string;
    link?: string;
    variant?: 'primary' | 'secondary';
  };
};
