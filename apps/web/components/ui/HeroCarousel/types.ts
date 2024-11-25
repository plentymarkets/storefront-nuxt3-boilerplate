export type Size = {
  width: string;
  height: string;
};

export type SizeKey = 'lg' | 'md' | 'sm' | 'xs';

export type Sizes = Record<SizeKey, { width: string; height: string }>;

export type HeroContentProps = {
  image?: Record<SizeKey, string> | object;
  alt?: string;
  tagline?: string;
  taglineColor?: string;
  heading?: string;
  headingColor?: string;
  description?: string;
  descriptionColor?: string;
  callToAction?: string;
  link?: string;
};
