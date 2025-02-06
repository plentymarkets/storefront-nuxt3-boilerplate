export type ImageTextProps = {
  image: {
    desktop?: string;
    tablet?: string;
    mobile?: string;
    alt: string;
    imageAlignment: 'left' | 'right';
  };

  text: {
    pretitle?: string;
    title?: string;
    subtitle?: string;
    htmlDescription?: string;
    textAlignment?: 'left' | 'center' | 'right';
  };
  button: {
    label?: string;
    link?: string;
    variant?: 'primary' | 'secondary';
  };
};

export interface ImageDimensions {
  width: number;
  height: number;
}
