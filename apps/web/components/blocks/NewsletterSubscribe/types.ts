export type NewsletterSubscribeProps = {
  name: string;
  type: string;
  content: NewsletterSubscribeContent;
  configuration?: {
    controls: {
      color: string;
      displayArrows: boolean;
    };
  };
  index?: number;
};
export type NewsletterSubscribeContent = {
  index?: number;
  text: {
    bgColor?: string;
    title?: string;
    htmlDescription?: string;
  };
  input: {
    displayNameInput?: boolean;
    nameIsRequired?: boolean;
  };
  button: {
    label?: string;
  };
};
