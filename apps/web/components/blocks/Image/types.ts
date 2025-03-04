export type ImageTextProps = {
  name: string;
  type: string;
  content: ImageTextContent;
  configuration?: {
    controls: {
      color: string;
      displayArrows: boolean;
    };
  };
  index?: number;
  meta: {
    uuid: string;
  };
};

export type ImageTextContent = {
  index?: number;
  wideScreen?: string;
  desktop?: string;
  tablet?: string;
  mobile?: string;
  alt: string;
  imageAlignment: 'left' | 'right';
};

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageFormProps {
  uuid?: string;
}
