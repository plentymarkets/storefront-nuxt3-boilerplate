export type MultiGridProps = {
  name: string;
  type: string;
  content: Block[];
  configuration: {
    columnWidths: number[];
  };
  meta: {
    uuid: string;
  };
  index?: number;
};
