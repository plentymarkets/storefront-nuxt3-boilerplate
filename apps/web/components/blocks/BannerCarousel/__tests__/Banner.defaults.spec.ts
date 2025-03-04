// import { describe, it, expect } from 'vitest';
// import { mount } from '@vue/test-utils';
// import { BlocksBannerCarouselBanner } from '#components';
//
// describe('Banner', () => {
//   describe('with default settings', () => {
//     const wrapper = mount(BlocksBannerCarouselBanner, {
//       props: {
//         bannerProps: {
//           name: 'Banner',
//           type: 'content',
//           content: {
//             image: {
//               wideScreen: '/test-desktop.jpg',
//               desktop: '/test-desktop.jpg',
//               tablet: '/test-tablet.jpg',
//               mobile: '/test-mobile.jpg',
//               alt: 'test alt text',
//             },
//             text: {
//               pretitle: 'Test pretitle',
//               title: 'Test title',
//               subtitle: 'Test subtitle',
//               htmlDescription: '<p>Test description</p>',
//               textAlignment: 'left',
//               justify: 'top',
//               align: 'left',
//               background: true,
//             },
//             button: {
//               label: 'Test button',
//               link: '/test-link',
//               variant: 'primary',
//             },
//           },
//         },
//         index: 0,
//       },
//     });
//
//     it('should render', () => {
//       expect(wrapper.html()).not.toBe(null);
//     });
//
//     it('should render all elements in the correct order', () => {
//       const expectedOrder = [
//         'image',
//         'overlay',
//         'content',
//         'pretitle',
//         'title',
//         'subtitle',
//         'description',
//         'button',
//       ];
//       const elements = wrapper.findAll('[data-testid^="banner-"]');
//       elements.forEach((element, index) => {
//         expect(element.attributes('data-testid')).toContain(expectedOrder[index]);
//       });
//     });
//
//     it('should have an image', () => {
//       const image = wrapper.find('[data-testid="banner-image-0"]');
//       expect(image.exists()).toBe(true);
//       expect(image.attributes('src')).toBe('/test-desktop.jpg');
//       expect(image.attributes('alt')).toBe('test alt text');
//     });
//
//     it('should have a content overlay', () => {
//       const overlay = wrapper.find('[data-testid="banner-overlay-0"]');
//       expect(overlay.exists()).toBe(true);
//       expect(overlay.attributes('style')).toContain('text-align: left');
//       expect(overlay.attributes('style')).toContain('justify-content: flex-start');
//       expect(overlay.attributes('style')).toContain('align-items: flex-start');
//     });
//
//     it('should have a content area', () => {
//       const content = wrapper.find('[data-testid="banner-content-0"]');
//       expect(content.exists()).toBe(true);
//     });
//
//     it('should have a pretitle', () => {
//       const pretitle = wrapper.find('[data-testid="banner-pretitle-0"]');
//       expect(pretitle.exists()).toBe(true);
//       expect(pretitle.text()).toBe('Test pretitle');
//     });
//
//     it('should have a title', () => {
//       const title = wrapper.find('[data-testid="banner-title-0"]');
//       expect(title.exists()).toBe(true);
//       expect(title.text()).toBe('Test title');
//     });
//
//     it('should have a subtitle', () => {
//       const subtitle = wrapper.find('[data-testid="banner-subtitle-0"]');
//       expect(subtitle.exists()).toBe(true);
//       expect(subtitle.text()).toBe('Test subtitle');
//     });
//
//     it('should have a description', () => {
//       const description = wrapper.find('[data-testid="banner-description-0"]');
//       expect(description.exists()).toBe(true);
//       expect(description.text()).toBe('Test description');
//       expect(description.html()).toContain('<p>Test description</p>');
//     });
//
//     it('should have a button', () => {
//       const button = wrapper.find('[data-testid="banner-button-0"]');
//       expect(button.exists()).toBe(true);
//       expect(button.attributes('to')).toBe('/test-link');
//       expect(button.attributes('class')).toContain('bg-primary-500');
//     });
//   });
// });
