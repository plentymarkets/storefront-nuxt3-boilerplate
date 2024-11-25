import { PageObject } from './PageObject';

export class CheckoutPageObject extends PageObject {
  get goToCheckoutButton() {
    return cy.getByTestId('checkout-button');
  }

  get goToGuestCheckoutButton() {
    return cy.getByTestId('guest-checkout-button');
  }

  get addContactInformationButton() {
    return cy.getByTestId('button').contains('Add contact information');
  }

  get addBillingAddressButton() {
    return cy.getByTestId('add-1-button');
  }

  get addShippingAddressButton() {
    return cy.getByTestId('button').contains('Add shipping address');
  }

  get contactInformationForm() {
    return cy.getByTestId('contact-information-form').find('input');
  }

  get saveShipping() {
    return cy.getByTestId('save-address-2');
  }

  get saveBilling() {
    return cy.getByTestId('save-address-1');
  }

  get contactInformationFormSaveButton() {
    return cy.getByTestId('contact-information-save-button');
  }

  get placeOrderButtons() {
    return cy.getByTestId('place-order-button');
  }

  get displaySuccessPages() {
    return cy.get('[data-testid="order-success-page"]', { timeout: 60000 });
  }

  get inputField() {
    return cy.getByTestId('contact-information-form').children('[type="email"]');
  }

  get modal() {
    return cy.getByTestId('checkout-edit-address-modal');
  }

   editBillingAddress() {
    cy.getByTestId('edit-address-1').click();
    return this;
  }

  get thankYouBanner() {
    return cy.getByTestId('success-header');
  }

  get orderPaymentStatus() {
    return cy.getByTestId('order-payment-status');
  }

  get firstNameInput() {
    return cy.getByTestId('input').find('input[name="firstName"]');
  }

  get lastNameInput() {
    return cy.getByTestId('input').find('input[name="lastName"]');
  }

  get countrySelect() {
    return cy.getByTestId('select').find('select[name="country"]');
  }

  get streetNameInput() {
    return cy.getByTestId('input').find('input[name="streetName"]');
  }

  get streetNumberInput() {
    return cy.getByTestId('input').find('input[name="streetNumber"]');
  }

  get cityInput() {
    return cy.getByTestId('input').find('input[name="city"]');
  }

  get stateSelect() {
    return cy.getByTestId('select').find('select[name="state"]');
  }

  get postalCodeInput() {
    return cy.getByTestId('input').find('input[name="zipCode"]');
  }

  get useShippingAsBilling() {
    return cy.getByTestId('use-shipping-as-billing');
  }

  get shippingAsBillingText() {
    return cy.getByTestId('address-info-text-1');
  }

  goToGuestCheckout() {
    this.goToGuestCheckoutButton.click();
    return this;
  }

  goToCheckout() {
    this.goToCheckoutButton.click();
    return this;
  }

  addContactInformation() {
    this.addContactInformationButton.eq(0).should('have.text', 'Add contact information');
    cy.waitUntilElementInDOM(() => {
      this.addContactInformationButton.click();
      return this.modal;
    });
    this.modal.should('be.visible');
    return this;
  }

  addBillingAddress() {
    this.addBillingAddressButton.eq(0).click();
    this.modal.should('be.visible');

    return this;
  }

  addShippingAddress() {
    this.addShippingAddressButton.eq(0).should('have.text', 'Add shipping address').click();
    this.modal.should('be.visible');
  }

  placeOrderButton() {
    cy.intercept('/plentysystems/doAdditionalInformation')
      .as('doAdditionalInformation')
      .intercept('/plentysystems/doPreparePayment')
      .as('doPreparePayment');

    this.placeOrderButtons.click();

    cy.wait('@doAdditionalInformation').wait('@doPreparePayment');

    return this;
  }

  placeCreditCartOrder() {
    this.placeOrderButtons.click();
    return this;
  }

  displaySuccessPage() {
    this.displaySuccessPages.should('be.visible');
    this.thankYouBanner.should('be.visible');
    return this;
  }

  displayFullyPaid() {
    this.orderPaymentStatus.contains('Paid');
    return this;
  }

  fillContactInformationForm() {
    cy.getFixture('addressForm').then(() => {
      const uniqueEmail = `test-order-${new Date().getTime()}@plentymarkets.com`;
      this.contactInformationForm.type(uniqueEmail);
      this.contactInformationFormSaveButton.click().should('not.exist');
    });
    return this;
  }

  acceptTerms() {
    cy.getByTestId('checkout-terms-checkbox').check();

    return this;
  }

  fillShippingAddressForm() {
    cy.intercept('/plentysystems/setCheckoutAddress')
      .as('setCheckoutAddress')
      .intercept('/plentysystems/getShippingProvider')
      .as('getShippingProvider')
      .intercept('/plentysystems/getPaymentProviders')
      .as('getPaymentProviders');

    this.fillAddressForm();

    cy.wait('@setCheckoutAddress').wait('@getShippingProvider').wait('@getPaymentProviders');

    return this;
  }

  shouldShowShippingAsBillingText() {
    this.shippingAsBillingText.contains('Same as shipping address');
    return this;
  }

  fillCreditCardForm() {
    cy.iframe('[title=paypal_card_number_field]').find('.card-field-number').first().type('4868719460707704');

    cy.iframe('[title=paypal_card_expiry_field]').find('.card-field-expiry').type('12/27');

    cy.iframe('[title=paypal_card_cvv_field]').find('.card-field-cvv').type('123');

    return this;
  }

  payCreditCard() {
    cy.getByTestId('pay-creditcard-button').click();
    return this;
  }

  checkCreditCard() {
    cy.intercept('/plentysystems/setPaymentProvider').as('setPaymentProvider');
    cy.getByTestId('payment-method-6008').check({ force: true });
    cy.wait('@setPaymentProvider');
    return this;
  }

  checkPayPal() {
    cy.intercept('/plentysystems/setPaymentProvider').as('setPaymentProvider');
    cy.getByTestId('payment-method-6001').check({ force: true });
    cy.wait('@setPaymentProvider');
    return this;
  }

  fillAddressForm() {
    cy.getFixture('addressForm').then((fixture) => {
      this.fillForm(fixture);
    });
    return this;
  }

  fillForm(fixture: any) {
    this.firstNameInput.type(fixture.firstName);
    this.lastNameInput.type(fixture.lastName);
    this.countrySelect.select(fixture.country);
    this.streetNameInput.type(fixture.streetName);
    this.streetNumberInput.type(fixture.apartment);
    this.cityInput.type(fixture.city);
    // this.stateSelect.select(fixture.state);
    this.postalCodeInput.type(fixture.zipCode);
    this.saveShipping.click({ force: true });
    return this;
  }

  get payPalButton() {
    return cy.get('.paypal-buttons-context-iframe').first();
  }
}
