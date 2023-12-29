/// <reference types="cypress" />

describe('Register as a customer', () => {

  beforeEach(() => {
    // Fill in user data in fixtures/user.json before running the test
    cy.fixture("user").as('userData')
  })

  it('Registers a customer on njuskalo.hr', function () {
    cy.visit('https://www.njuskalo.hr/')

    // Prihvati i zatvori
    cy.contains('Prihvati i zatvori')
      .click()

    cy.get('body').then(($body) => {
      // Sometimes this element is not visible so we need to check if it is visible
      if ($body.find('.PrivacyPolicyNotice-close--asButton').is(':visible')) {
        cy.log('Privacy policy notice is visible')
        cy.get('.PrivacyPolicyNotice-close--asButton')
          .click()
      }
    })

    // cy.get('.PrivacyPolicyNotice-close--asButton')
    //   .click()

    cy.contains('Registracija')
      .click()

    cy.contains('Privatni korisnik')
      .should('be.visible')
      .click()

    // Forma za registraciju
    cy.get('form').scrollIntoView()

    // Username, password, email
    cy.get('#form1-username')
      .type(this.userData.username)

    cy.get('#form1-password')
      .type(this.userData.password)

    cy.get('#form1-email')
      .type(this.userData.email)

    // Politika privatnosti
    cy.get('#acceptance-acceptPrivacyPolicy')
      .check()
    // Uvjeti korištenja
    cy.get('#acceptance-acceptTermsAndConditions')
      .check()

    cy.get('form')
      .submit()

    cy.contains('Preskoči i završi registraciju')
      .click()

    cy.contains('Klikni na aktivacijski link koji sam ti upravo poslao!')
      .should('be.visible')
  })

})
