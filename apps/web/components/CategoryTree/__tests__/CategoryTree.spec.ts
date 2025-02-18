import { CategoryTree } from '#components';
import { CategoryTreeMock } from '~/__tests__/__mocks__/category-tree.mock';
import { CategoryMock } from '../../../__tests__/__mocks__/category.mock';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';


describe('<CategoryTree/>', () => {

  mockNuxtImport('useCategoryTree', () => {
    return () => {
      return { data: computed(() => CategoryTreeMock) };
    };
  });

  it('should render component', () => {

    const { getByTestId } = mount(CategoryTree, {
      props: {
        category: CategoryMock
      }
    });

    expect(getByTestId('category-tree'));
  });
});
