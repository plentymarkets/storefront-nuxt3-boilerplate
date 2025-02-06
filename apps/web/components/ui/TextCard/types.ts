export type TextCardProps = {
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
