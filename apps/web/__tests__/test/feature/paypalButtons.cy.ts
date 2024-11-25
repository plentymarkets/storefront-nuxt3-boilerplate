import { CartPageObject } from '../../support/pageObjects/CartPageObject';
import { CheckoutPageObject } from '../../support/pageObjects/CheckoutPageObject';
import { HomePageObject } from '../../support/pageObjects/HomePageObject';
import { ProductListPageObject } from '../../support/pageObjects/ProductListPageObject';
import { paths } from '../../../utils/paths';
import { MyAccountPageObject } from '../../support/pageObjects/MyAccountPageObject';

const checkout = new CheckoutPageObject();
const cart = new CartPageObject();
const homePage = new HomePageObject();
const productListPage = new ProductListPageObject();
const myAccount: MyAccountPageObject = new MyAccountPageObject();

beforeEach(() => {
  cy.clearCookies();
  cy.setCookie('vsf-locale', 'en');
  cy.setCookie('consent-cookie', '{"CookieBar.essentials.label":{"CookieBar.essentials.cookies.plentyId.name":true,"CookieBar.essentials.cookies.vsfLocale.name":true,"CookieBar.essentials.cookies.consentCookie.name":true,"CookieBar.essentials.cookies.cloudflareTurnstile.name":true},"CookieBar.externalMedia.label":{},"CookieBar.functional.label":{"CookieBar.functional.cookies.scriptDemo.name":true,"CookieBar.functional.cookies.payPal.name":true},"CookieBar.marketing.label":{}}');
  cy.visitAndHydrate(paths.home);
});

describe('Feature: PayPal button rendering', () => {
  it('[smoke] Render PayPal button on checkout after refresh', () => {
    cy.intercept('/plentysystems/doLogin').as('doLogin');
    cy.intercept('/plentysystems/getPaymentProviders').as('getPaymentProviders');

    cy.visitAndHydrate(paths.authLogin);
    myAccount.successLogin();

    cy.wait('@doLogin').visitAndHydrate(paths.home);

    homePage.goToCategory();
    productListPage.addToCart();
    cart.openCart();
    checkout.goToCheckout().checkPayPal();

    cy.reload();
    cy.wait('@getPaymentProviders');

    checkout.payPalButton.should("exist");
  });
});