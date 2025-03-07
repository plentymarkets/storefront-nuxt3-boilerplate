export const usePageMeta = () => {
  const pageMeta = useState('pageMeta', () => ({
    name: '',
    icon: '',
  }));

  const setPageMeta = (name: string, icon: string) => {
    pageMeta.value.name = name;
    pageMeta.value.icon = icon;
  };

  return { setPageMeta, pageMeta };
};
