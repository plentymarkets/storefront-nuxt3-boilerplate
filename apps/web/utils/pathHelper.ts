export const removeTrailingSlash = (url: string | undefined): string | undefined => {
  return url?.replace(/[/\\]+$/, '');
};
