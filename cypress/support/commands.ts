Cypress.Commands.add('clickIngredientInIndexedContainer', (index: number) => {
    cy.get("[data-cy='ingredient-container']", { timeout: 10000 }).eq(index)
        .find("button").click();
});

Cypress.Commands.add('checkModalViibility', (isModalVisible: boolean) => {
    cy.get("[data-cy='modal']", { timeout: 10000 }).should(`${!isModalVisible ? "not." : ""}exist`);
});

declare namespace Cypress {
    interface Chainable {
        clickIngredientInIndexedContainer(index: number): Chainable<void>;
        checkModalViibility(isModalVisible: boolean): Chainable<void>;
    }
}