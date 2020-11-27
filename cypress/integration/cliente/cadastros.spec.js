/// <reference types="cypress" />

const url = `${Cypress.config("baseUrl")}/api/v1/customer`;
const verb = "POST";
const body = {
    customer: {
        address: {
            zipCode: "13092902",
            street: "Av. Iguatemi",
            number: "13",
            complement: "Apto 63",
        },
        birthDate: "1991-01-01",
        cpf: "58037125076",
        name: "Jose da Silva",
    },
};

describe("POST /api/v1/customer", () => {
    context("Campos válidos", () => {
        it("Todos os campos válidos", () => {
            executeRequest();

            validacaoStatus(201);
        });
    });

    context("Validação do CEP", () => {    
        it("CEP com 7 caracteres", () => {
            body.address.zipCode = "1309290";
    
            executeRequest();
    
            validacaoStatus(400);
            validacaoCampoInvalido("zipCode");
        });
    
        it("CEP com 9 caracteres", () => {
            body.address.zipCode = "130929021";
    
            executeRequest();
    
            validacaoStatus(400);
            validacaoCampoInvalido("zipCode");
        });
    
        it("CEP com letras", () => {
            body.address.zipCode = "13092902A";
    
            executeRequest();
    
            validacaoStatus(400);
            validacaoCampoInvalido("zipCode");
        });
    
        it("CEP inexistente", () => {
            body.address.zipCode = null;
    
            executeRequest();
    
            validacaoStatus(400);
            validacaoCampoInexistente("zipCode");
        });
    });

    context("Validação da Rua", () => {
        it("Rua com 61 caracteres", () => {
            body.address.street = "Av. Iguatemi AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

            executeRequest();

            validacaoStatus(400);
            validacaoCampoInvalido("street");
        });

        it("Rua inexistente", () => {
            body.address.street = null;

            executeRequest();

            validacaoStatus(400);
            validacaoCampoInexistente("street");
        });
    });
});

function executeRequest() {
    cy.request(verb, url, body).as("cadastroCliente");
}

function validacaoStatus(status) {
    cy.get("@cadastroCliente")
        .its("status")
        .should("equal", status);
}

function validacaoCampoInvalido(campo) {
    cy.get("@cadastroCliente").then(response => {
        expect(response.body).to.contain(`Campo ${campo} inválido`);
    });
}

function validacaoCampoInexistente(campo) {
    cy.get("@cadastroCliente").then(response => {
        expect(response.body).to.contain(`Campo ${campo} não informado`);
    });
}