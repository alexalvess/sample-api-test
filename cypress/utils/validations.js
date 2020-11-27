/// <reference types="cypress" />

export function executeRequest() {
    cy.request(verb, url, body).as("cadastroCliente");
}

export function validacaoStatus(status) {
    cy.get("@cadastroCliente")
        .its("status")
        .should("equal", status);
}

export function validacaoCampoInvalido(campo) {
    cy.get("@cadastroCliente").then(response => {
        expect(response.body).to.contain(`Campo ${campo} inválido`);
    });
}

export function validacaoCampoInexistente(campo) {
    cy.get("@cadastroCliente").then(response => {
        expect(response.body).to.contain(`Campo ${campo} não informado`);
    });
}