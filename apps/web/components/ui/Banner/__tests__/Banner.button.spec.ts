import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils'
import { UiBanner } from '#components';

describe('Banner button', () => {
  it('should not render a button if no button is provided', () => {
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

    expect(wrapper.find('[data-testid="banner-button-0"]').exists()).toBe(false);
  });

  it('should not render a button if no label is provided', () => {
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
          button: {
            link: '/test-link',
          },
        },

        index: 0,
      },
    });

    expect(wrapper.find('[data-testid="banner-button-0"]').exists()).toBe(false);
  });

  it('should not render a button if no link is provided', () => {
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
          button: {
            label: 'Test button',
          },
        },

        index: 0,
      },
    });

    expect(wrapper.find('[data-testid="banner-button-0"]').exists()).toBe(false);
  });

  it('should set the given button variant', () => {
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
          button: {
            label: 'Test button',
            link: '/test-link',
            variant: 'secondary',
          },
        },

        index: 0,
      },
    });

    const button = wrapper.find('[data-testid="banner-button-0"]');

    expect(button.attributes('class')).toContain('text-primary-500');
  });
});
