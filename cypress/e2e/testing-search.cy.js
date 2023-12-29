/// <reference types="cypress" />

describe('Testing Njuškalo search', () => {
  beforeEach(() => {
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

    // Fill in user data in fixtures/user.json before running the test
    cy.fixture("user").as('userData').then((userData) => {
      cy.login(userData.username, userData.password)
    })
  })

  it('User is logged in and is able to log out', function () {
    // Checking if username is visible
    cy.get('span[class="Header-userCaption"]')
      .contains(this.userData.username)
      .should('be.visible')
      .as('headerUsername')

    // Checking if logout button is visible
    cy.get('a')
      .contains('Odjava')
      .should('be.visible')
      .as('logoutButton')

    // Logging out
    cy.get('@logoutButton')
      .click()

    // Checking if username is not visible
    cy.get('@headerUsername')
      .should('not.exist')

    // Checking if login and registration buttons are visible
    cy.contains('Prijava')
      .should('be.visible')
    cy.contains('Registracija')
      .should('be.visible')
  })

  it('Testing search for Audi A4 cheaper than 15000€', () => {
    // #keywords is the search input field
    cy.get('#keywords')
      .type('Audi A4')
      .type('{enter}')

    // Set the max price to 15000€
    cy.get('input[name="price[max]"]')
      .type('15000')

    cy.get('#detailedSearch')
      .submit()

    // Check if ad title is visible
    cy.get('h3[class="entity-title"]')
      .contains('Audi A4', { matchCase: false })
      .should('be.visible')
  })

  it('Testing search by ID', () => {
    const adId = '1349039'
    cy.get('#keywords')
      .type(adId)
      .type('{enter}')

    // Check if ad title is visible
    cy.get('h1')
      .contains('TEST OGLAS NJUŠKALO TIM (prodaja)')
      .should('be.visible')

    // Check if URL contains adId
    cy.url()
      .should('include', adId)
  })
})
