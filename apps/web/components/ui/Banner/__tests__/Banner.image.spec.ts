import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils'
import { UiBanner } from '#components';

describe('Banner image', () => {
  it('should not render an image if no image is provided', () => {
    const wrapper = mount(UiBanner, {
      props: {
        bannerProps: {
          text: {
            pretitle: 'Test pretitle',
            title: 'Test title',
            subtitle: 'Test subtitle',
            htmlDescription: '<p>Test description</p>',
          },
          image: {},
          controls: {},
          button: {},
        },


        index: 0,
      },
    });

    const image = wrapper.find('[data-testid="banner-image-0"]');

    expect(image.attributes('src')).toBe('');
    expect(image.attributes('alt')).toBe('');
    expect(image.attributes('style')).toContain('height: 576px');

    expect(wrapper.find('[data-testid="banner-overlay-0"]').exists()).toBe(true);
  });

  it('should set the given brightness', () => {
    const wrapper = mount(UiBanner, {
      props: {
        bannerProps: {
          image: {
            wideScreen: '/test-desktop.jpg',
            desktop: '/test-desktop.jpg',
            tablet: '/test-tablet.jpg',
            mobile: '/test-mobile.jpg',
            alt: 'test alt text',
            brightness: 0.5,
          },
          text: {},
          controls: {},
          button: {},
        },

        index: 0,
      },
    });

    const image = wrapper.find('[data-testid="banner-image-0"]');

    expect(image.attributes('style')).toContain('filter: brightness(0.5)');
  });
});
