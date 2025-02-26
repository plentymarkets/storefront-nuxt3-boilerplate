import { paths } from '../../../utils/paths';

describe('Preview Cookie', () => {
  const setPwaCookie = (value: string) => {
    cy.setCookie('pwa', value);
  };

  const checkPwaCookieExists = () => {
    cy.getCookie('pwa')
      .should('exist')
      .then((cookie) => {
        assert.isNotNull(cookie, 'Cookie should not be null');
        assert.isNotEmpty(cookie?.value, 'Cookie value should not be empty');
      });
  };
  const toolbarIsVisible = () => {
    cy.get('[data-testid="edit-mode-toolbar"]').should('be.visible');
  };

  const toolbarIsNotVisible = () => {
    cy.get('[data-testid="edit-mode-toolbar"]').should('not.exist');
  };
  const checkPwaCookieIsRemoved = () => {
    cy.clearCookie('pwa');
    cy.reload();
    cy.getCookie('pwa').should('not.exist');
  };


  beforeEach(() => {
    setPwaCookie('1');
    cy.visitAndHydrate(paths.home);
  });

  it('should display the editor if the pwa cookie is set', () => {
    checkPwaCookieExists();
    toolbarIsVisible();
  });

  it('should not show the editor if the pwa cookie is not set', () => {
    checkPwaCookieIsRemoved();
    toolbarIsNotVisible();
  });
});
