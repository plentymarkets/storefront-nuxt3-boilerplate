export type NewsletterSubscribeProps = {
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
