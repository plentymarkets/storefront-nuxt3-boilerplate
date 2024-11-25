import { CartPageObject } from '../../support/pageObjects/CartPageObject';
import { CheckoutPageObject } from '../../support/pageObjects/CheckoutPageObject';
import { HomePageObject } from '../../support/pageObjects/HomePageObject';
import { ProductListPageObject } from '../../support/pageObjects/ProductListPageObject';
import { paths } from '../../../utils/paths';

const checkout = new CheckoutPageObject();
const cart = new CartPageObject();
const homePage = new HomePageObject();
const productListPage = new ProductListPageObject();

describe('Smoke: PayPal credit card order', () => {
  beforeEach(() => {
    cy.setCookie('vsf-locale', 'en');
    cy.setCookie('consent-cookie', '{"CookieBar.essentials.label":{"CookieBar.essentials.cookies.plentyId.name":true,"CookieBar.essentials.cookies.vsfLocale.name":true,"CookieBar.essentials.cookies.consentCookie.name":true,"CookieBar.essentials.cookies.cloudflareTurnstile.name":true},"CookieBar.externalMedia.label":{},"CookieBar.functional.label":{"CookieBar.functional.cookies.scriptDemo.name":true,"CookieBar.functional.cookies.payPal.name":true},"CookieBar.marketing.label":{}}');
  });

  it('[smoke] Check if status on order gets updated when paying with paypal credit card', () => {
    cy.visitAndHydrate(paths.home);

    homePage.goToCategory();
    productListPage.addToCart();

    cart.openCart();
    checkout
      .goToCheckout()
      .goToGuestCheckout()
      .fillContactInformationForm()
      .fillShippingAddressForm()
      .acceptTerms()
      .checkCreditCard()
      .placeCreditCartOrder()
      .fillCreditCardForm()
      .payCreditCard()
      .displaySuccessPage()
      .displayFullyPaid();
  });
});
