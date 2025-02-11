import { paths } from '../../../utils/paths';
import { EditorObject } from '../../support/pageObjects/EditorObject';

describe('Recommended test', () => {
  const editor = new EditorObject();

  beforeEach(() => {
    cy.visitAndHydrate(paths.home);
  });

  it('drawer should open recommended section', () => {
    editor.openBlockSection('4');
    editor.checkRecommendedSection();
  });

  it('should check if default information is correct', () => {
    editor.openBlockSection('4');
    editor.checkExistanceAndValue('recommended-block-pretitle', 'More than just technology');
    editor.checkExistanceAndValue('recommended-block-title', 'Explore our fashion collection');
    editor.checkExistanceAndValue('recommended-block-subtitle', 'Sportive fashion and accessoires for everybody.');
    editor.checkExistanceAndValue('recommended-block-htmlDescription', "<a class='underline' href='https://plentyshop.plentymarkets.com/wear' target='_self'>To our full collection.</a>");
    editor.checkExistanceAndValue('recommended-block-categoryId', '49');
    editor.checkExistanceAndValue('recommended-block-textcolor', '#000');
    editor.checkExistance('recommended-block-textAlignment-left-check')
  });

  it('should check if information changes in page after change', () => {
    // after is open we should check if informatiom is in fields.
    // recommended-text-${props.index}
  });

  it('should check empty field edge cases', () => {
    // after is open we should check if informatiom is in fields.
    // recommended-text-${props.index}
  });
});