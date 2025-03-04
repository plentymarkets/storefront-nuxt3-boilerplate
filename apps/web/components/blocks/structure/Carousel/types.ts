export type CarouselStructureProps = {
  name: string;
  type: string;
  content: unknown[];
  configuration: {
    controls: {
      color: string;
      displayArrows: boolean;
    };
  };
  index: number;
  meta: {
    uuid: string;
  };
};
