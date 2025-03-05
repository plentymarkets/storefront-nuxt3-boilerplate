import type { Category } from './types';
import { watch } from 'vue';

export const usePages = async () => {
  const { t, locale } = useI18n();
  const { getCategoryTree } = useCategoryTree();

  const pages = useState<{ name: string; path: string; children?: { name: string; path: string }[] | undefined }[]>(
    'pages',
    () => [],
  );

  const fetchPages = async () => {
    const data = await getCategoryTree();

    const transformData = (
      data: Category[],
      isRoot = true,
    ): { name: string; path: string; children?: { name: string; path: string }[] | undefined }[] => {
      const transformedData = data.map((item: Category) => ({
        name: item.details[0].name,
        path: `/${item.details[0].nameUrl}`,
        children: item.children ? transformData(item.children, false) : undefined,
      }));

      if (isRoot && !transformedData.some((page) => page.name === 'Homepage')) {
        transformedData.unshift({
          name: t('homepage.homepagetitle'),
          path: '/',
          children: undefined,
        });
      }

      return transformedData;
    };

    pages.value = transformData(data);
  };

  if (pages.value.length === 0) {
    await fetchPages();
  }

  watch(locale, async () => {
    await fetchPages();
  });

  return {
    pages,
  };
};
