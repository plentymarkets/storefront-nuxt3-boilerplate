export type BannerProps = {
  controls: {
    color?: string;
  };
  image: {
    wideScreen?: string;
    desktop?: string;
    tablet?: string;
    mobile?: string;
    alt?: string;
    brightness?: number;
  };
  text: {
    color?: string;
    bgcolor?: string;
    bgopacity?: number;
    pretitle?: string;
    title?: string;
    subtitle?: string;
    htmlDescription?: string;
    textAlignment?: 'left' | 'center' | 'right';
    justify?: 'top' | 'center' | 'bottom';
    align?: 'left' | 'center' | 'right';
    background?: boolean;
  };
  button: {
    label?: string;
    link?: string;
    variant?: 'primary' | 'secondary';
  };
};
