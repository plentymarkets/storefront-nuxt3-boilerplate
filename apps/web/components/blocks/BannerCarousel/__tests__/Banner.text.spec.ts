// import { describe, it, expect } from 'vitest';
// import { mount } from '@vue/test-utils';
// import { BlocksBannerCarouselBanner } from '#components';
//
// describe('Banner text', () => {
//   it('should not render a pretitle if no pretitle is provided', () => {
//     const wrapper = mount(BlocksBannerCarouselBanner, {
//       props: {
//         name: 'Banner',
//         type: 'content',
//         content: {
//           text: {
//             title: 'Test title',
//             subtitle: 'Test subtitle',
//             htmlDescription: '<p>Test description</p>',
//           },
//           image: {},
//           button: {},
//         },
//         index: 0,
//       },
//     });
//
//     expect(wrapper.find('[data-testid="banner-pretitle-0"]').exists()).toBe(false);
//     expect(wrapper.find('[data-testid="banner-title-0"]').exists()).toBe(true);
//     expect(wrapper.find('[data-testid="banner-subtitle-0"]').exists()).toBe(true);
//     expect(wrapper.find('[data-testid="banner-description-0"]').exists()).toBe(true);
//   });
//
//   it('should not render a title if no title is provided', () => {
//     const wrapper = mount(BlocksBannerCarouselBanner, {
//       props: {
//         bannerProps: {
//           name: 'Banner',
//           type: 'content',
//           content: {
//             text: {
//               pretitle: 'Test pretitle',
//               subtitle: 'Test subtitle',
//               htmlDescription: '<p>Test description</p>',
//             },
//             image: {},
//             button: {},
//           },
//         },
//         index: 0,
//       },
//     });
//
//     expect(wrapper.find('[data-testid="banner-pretitle-0"]').exists()).toBe(true);
//     expect(wrapper.find('[data-testid="banner-title-0"]').exists()).toBe(false);
//     expect(wrapper.find('[data-testid="banner-subtitle-0"]').exists()).toBe(true);
//     expect(wrapper.find('[data-testid="banner-description-0"]').exists()).toBe(true);
//   });
//
//   it('should not render a subtitle if no subtitle is provided', () => {
//     const wrapper = mount(BlocksBannerCarouselBanner, {
//       props: {
//         bannerProps: {
//           name: 'Banner',
//           type: 'content',
//           content: {
//             text: {
//               pretitle: 'Test pretitle',
//               title: 'Test title',
//               htmlDescription: '<p>Test description</p>',
//             },
//             image: {},
//             button: {},
//           },
//         },
//         index: 0,
//       },
//     });
//
//     expect(wrapper.find('[data-testid="banner-pretitle-0"]').exists()).toBe(true);
//     expect(wrapper.find('[data-testid="banner-title-0"]').exists()).toBe(true);
//     expect(wrapper.find('[data-testid="banner-subtitle-0"]').exists()).toBe(false);
//     expect(wrapper.find('[data-testid="banner-description-0"]').exists()).toBe(true);
//   });
//
//   it('should not render a description if no description is provided', () => {
//     const wrapper = mount(BlocksBannerCarouselBanner, {
//       props: {
//         bannerProps: {
//           name: 'Banner',
//           type: 'content',
//           content: {
//             text: {
//               pretitle: 'Test pretitle',
//               title: 'Test title',
//               subtitle: 'Test subtitle',
//             },
//             image: {},
//             button: {},
//           },
//         },
//         index: 0,
//       },
//     });
//
//     expect(wrapper.find('[data-testid="banner-pretitle-0"]').exists()).toBe(true);
//     expect(wrapper.find('[data-testid="banner-title-0"]').exists()).toBe(true);
//     expect(wrapper.find('[data-testid="banner-subtitle-0"]').exists()).toBe(true);
//     expect(wrapper.find('[data-testid="banner-description-0"]').exists()).toBe(false);
//   });
//
//   it('should set the given text color', () => {
//     const wrapper = mount(BlocksBannerCarouselBanner, {
//       props: {
//         bannerProps: {
//           name: 'Banner',
//           type: 'content',
//           content: {
//             text: {
//               pretitle: 'Test pretitle',
//               title: 'Test title',
//               subtitle: 'Test subtitle',
//               htmlDescription: '<p>Test description</p>',
//               color: 'red',
//             },
//             image: {},
//             button: {},
//           },
//         },
//         index: 0,
//       },
//     });
//
//     const overlay = wrapper.find('[data-testid="banner-overlay-0"]');
//     expect(overlay.attributes('style')).toContain('color: red');
//   });
//
//   it('should set the given background color', () => {
//     const wrapper = mount(BlocksBannerCarouselBanner, {
//       props: {
//         bannerProps: {
//           name: 'Banner',
//           type: 'content',
//           content: {
//             text: {
//               pretitle: 'Test pretitle',
//               title: 'Test title',
//               subtitle: 'Test subtitle',
//               htmlDescription: '<p>Test description</p>',
//               bgcolor: '#0000FF',
//               background: true,
//             },
//             image: {},
//             button: {},
//           },
//         },
//         index: 0,
//       },
//     });
//
//     const content = wrapper.find('[data-testid="banner-content-0"]');
//     expect(content.attributes('style')).toContain('background-color: rgba(0, 0, 255, 1)');
//   });
//
//   it('should set the given background opacity', () => {
//     const wrapper = mount(BlocksBannerCarouselBanner, {
//       props: {
//         bannerProps: {
//           name: 'Banner',
//           type: 'content',
//           content: {
//             text: {
//               pretitle: 'Test pretitle',
//               title: 'Test title',
//               subtitle: 'Test subtitle',
//               htmlDescription: '<p>Test description</p>',
//               bgopacity: 0.5,
//               background: true,
//             },
//             image: {},
//             button: {},
//           },
//         },
//         index: 0,
//       },
//     });
//
//     const content = wrapper.find('[data-testid="banner-content-0"]');
//     expect(content.attributes('style')).toContain('background-color: rgba(255, 255, 255, 0.5)');
//   });
//
//   describe('text alignment', () => {
//     it('should align text to the left by default', () => {
//       const wrapper = mount(BlocksBannerCarouselBanner, {
//         props: {
//           bannerProps: {
//             name: 'Banner',
//             type: 'content',
//             content: {
//               text: {
//                 pretitle: 'Test pretitle',
//                 title: 'Test title',
//                 subtitle: 'Test subtitle',
//                 htmlDescription: '<p>Test description</p>',
//               },
//               image: {},
//               button: {},
//             },
//           },
//           index: 0,
//         },
//       });
//
//       const overlay = wrapper.find('[data-testid="banner-overlay-0"]');
//       expect(overlay.attributes('style')).toContain('text-align: left');
//     });
//
//     it('should align text to the center', () => {
//       const wrapper = mount(BlocksBannerCarouselBanner, {
//         props: {
//           bannerProps: {
//             name: 'Banner',
//             type: 'content',
//             content: {
//               text: {
//                 pretitle: 'Test pretitle',
//                 title: 'Test title',
//                 subtitle: 'Test subtitle',
//                 htmlDescription: '<p>Test description</p>',
//                 textAlignment: 'center',
//               },
//               image: {},
//               button: {},
//             },
//           },
//           index: 0,
//         },
//       });
//
//       const overlay = wrapper.find('[data-testid="banner-overlay-0"]');
//       expect(overlay.attributes('style')).toContain('text-align: center');
//     });
//
//     it('should align text to the right', () => {
//       const wrapper = mount(BlocksBannerCarouselBanner, {
//         props: {
//           bannerProps: {
//             name: 'Banner',
//             type: 'content',
//             content: {
//               text: {
//                 pretitle: 'Test pretitle',
//                 title: 'Test title',
//                 subtitle: 'Test subtitle',
//                 htmlDescription: '<p>Test description</p>',
//                 textAlignment: 'right',
//               },
//               image: {},
//               button: {},
//             },
//           },
//           index: 0,
//         },
//       });
//
//       const overlay = wrapper.find('[data-testid="banner-overlay-0"]');
//       expect(overlay.attributes('style')).toContain('text-align: right');
//     });
//   });
//
//   describe('justify content', () => {
//     it('should justify content to the start by default', () => {
//       const wrapper = mount(BlocksBannerCarouselBanner, {
//         props: {
//           bannerProps: {
//             name: 'Banner',
//             type: 'content',
//             content: {
//               text: {
//                 pretitle: 'Test pretitle',
//                 title: 'Test title',
//                 subtitle: 'Test subtitle',
//                 htmlDescription: '<p>Test description</p>',
//               },
//               image: {},
//               button: {},
//             },
//           },
//           index: 0,
//         },
//       });
//
//       const overlay = wrapper.find('[data-testid="banner-overlay-0"]');
//       expect(overlay.attributes('style')).toContain('justify-content: flex-start');
//     });
//
//     it('should justify content to the center', () => {
//       const wrapper = mount(BlocksBannerCarouselBanner, {
//         props: {
//           bannerProps: {
//             name: 'Banner',
//             type: 'content',
//             content: {
//               text: {
//                 pretitle: 'Test pretitle',
//                 title: 'Test title',
//                 subtitle: 'Test subtitle',
//                 htmlDescription: '<p>Test description</p>',
//                 justify: 'center',
//               },
//               image: {},
//               button: {},
//             },
//           },
//           index: 0,
//         },
//       });
//
//       const overlay = wrapper.find('[data-testid="banner-overlay-0"]');
//       expect(overlay.attributes('style')).toContain('justify-content: center');
//     });
//
//     it('should justify content to the end', () => {
//       const wrapper = mount(BlocksBannerCarouselBanner, {
//         props: {
//           bannerProps: {
//             name: 'Banner',
//             type: 'content',
//             content: {
//               text: {
//                 pretitle: 'Test pretitle',
//                 title: 'Test title',
//                 subtitle: 'Test subtitle',
//                 htmlDescription: '<p>Test description</p>',
//                 justify: 'bottom',
//               },
//               image: {},
//               button: {},
//             },
//           },
//           index: 0,
//         },
//       });
//
//       const overlay = wrapper.find('[data-testid="banner-overlay-0"]');
//       expect(overlay.attributes('style')).toContain('justify-content: flex-end');
//     });
//   });
//
//   describe('align items', () => {
//     it('should align items to the start by default', () => {
//       const wrapper = mount(BlocksBannerCarouselBanner, {
//         props: {
//           bannerProps: {
//             name: 'Banner',
//             type: 'content',
//             content: {
//               text: {
//                 pretitle: 'Test pretitle',
//                 title: 'Test title',
//                 subtitle: 'Test subtitle',
//                 htmlDescription: '<p>Test description</p>',
//               },
//               image: {},
//               button: {},
//             },
//           },
//           index: 0,
//         },
//       });
//
//       const overlay = wrapper.find('[data-testid="banner-overlay-0"]');
//       expect(overlay.attributes('style')).toContain('align-items: flex-start');
//     });
//
//     it('should align items to the center', () => {
//       const wrapper = mount(BlocksBannerCarouselBanner, {
//         props: {
//           bannerProps: {
//             name: 'Banner',
//             type: 'content',
//             content: {
//               text: {
//                 pretitle: 'Test pretitle',
//                 title: 'Test title',
//                 subtitle: 'Test subtitle',
//                 htmlDescription: '<p>Test description</p>',
//                 align: 'center',
//               },
//               image: {},
//               button: {},
//             },
//           },
//           index: 0,
//         },
//       });
//
//       const overlay = wrapper.find('[data-testid="banner-overlay-0"]');
//       expect(overlay.attributes('style')).toContain('align-items: center');
//     });
//
//     it('should align items to the end', () => {
//       const wrapper = mount(BlocksBannerCarouselBanner, {
//         props: {
//           bannerProps: {
//             name: 'Banner',
//             type: 'content',
//             content: {
//               text: {
//                 pretitle: 'Test pretitle',
//                 title: 'Test title',
//                 subtitle: 'Test subtitle',
//                 htmlDescription: '<p>Test description</p>',
//                 align: 'right',
//               },
//               image: {},
//               button: {},
//             },
//           },
//           index: 0,
//         },
//       });
//
//       const overlay = wrapper.find('[data-testid="banner-overlay-0"]');
//       expect(overlay.attributes('style')).toContain('align-items: flex-end');
//     });
//   });
// });
