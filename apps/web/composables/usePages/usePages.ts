import type { CategoryTreeItem } from '@plentymarkets/shop-api';
export const usePages = async () => {
  const { t, locale } = useI18n();
  const { data } = useCategoryTree();

  const pages = useState<{ name: string; path: string; children?: { name: string; path: string }[] | undefined }[]>(
    'pages',
    () => [],
  );

  const fetchPages = async () => {
    const transformData = (
      data: CategoryTreeItem[],
      parentPath = '',
      isRoot = true,
    ): { name: string; path: string; children?: { name: string; path: string }[] | undefined }[] => {
      const transformedData = data
        .map((item: CategoryTreeItem) => {
          if (!item.details || item.details.length === 0) {
            return null;
          }

          const currentPath = `${parentPath}/${item.details[0].nameUrl}`;

          const children = item.children ? transformData(item.children, currentPath, false) : undefined;

          return {
            name: item.details[0].name,
            path: currentPath,
            children,
          };
        })
        .filter(Boolean);

      if (isRoot && !transformedData.some((page) => page && page.name === 'Homepage')) {
        transformedData.unshift({
          name: t('homepage.homepagetitle'),
          path: '/',
          children: undefined,
        });
      }

      return transformedData as {
        name: string;
        path: string;
        children?: { name: string; path: string }[] | undefined;
      }[];
    };

    pages.value = transformData(data.value);
  };

  if (pages.value.length === 0) {
    await fetchPages();
  }

  watch(locale, async () => {
    await fetchPages();
  });

  watch(data, async () => {
    await fetchPages();
  });

  return {
    pages,
  };
};
