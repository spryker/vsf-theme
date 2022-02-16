describe('Basic tests', () => {
  it('should navigate to Product Listing Page (PLP)', () => {
    cy.visit('/');

    cy.get('[data-cy=svsf-appHeader-logo-image]').should('be.visible');
    cy.get(
      '[data-cy=svsf-bottomNavigation-menu-bottom-navigation-item]',
    ).click();
    cy.get('[data-cy=svsf-appHeader-mobileMenuPopUp]').should('be.visible');

    cy.get('[data-cy=svsf-appHeader-category-Computers]').click();
    cy.get(
      '[data-cy=svsf-appHeader-mobileMenuPopUp] [data-cy=svsf-appHeader-subcategory-0]',
    )
      .should('be.visible')
      .first()
      .click();

    cy.url().should('include', 'c/computers');
  });

  it('navigate to Product Detail Page (PDP)', () => {
    cy.visit('/c/computers');

    cy.get('.products__grid').should('be.visible');
    cy.get('[data-cy=svsf-categorySection-product] .sf-product-card__title')
      .first()
      .should('be.visible')
      .click();

    cy.get('#product').should('be.visible');
  });

  it('add product to cart', () => {
    cy.visit('/p/073/samsung-galaxy-note-3-073');

    cy.get('#product').should('be.visible');
    cy.get('[data-cy=svsf-productSection-heading] .sf-heading__title')
      .should('be.visible')
      .invoke('text')
      .invoke('trim')
      .as('productName');

    cy.get(
      '[data-cy=svsf-productSection-addToCart] .sf-add-to-cart__button',
    ).should('be.disabled');
    cy.get('[data-cy=svsf-productSection-filter-select] .sf-select__dropdown')
      .should('be.visible')
      .select(1);
    cy.get('[data-cy=svsf-productSection-addToCart] .sf-add-to-cart__button')
      .should('not.be.disabled')
      .click();

    cy.get(
      '[data-cy=svsf-bottomNavigation-cart-bottom-navigation-item]',
    ).click();
    cy.get('[data-cy=svsf-cartSidebar-sideBar] .sf-sidebar__aside').should(
      'be.visible',
    );

    cy.get(
      '[data-cy=svsf-cartSidebar-sideBar] .collected-product-list .sf-collected-product .sf-collected-product__title',
    )
      .first()
      .invoke('text')
      .invoke('trim')
      .then((title) => {
        cy.get('@productName').should('be.eq', title);
      });
  });
});
