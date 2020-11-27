/// <reference types="cypress" />

const url = `${Cypress.config("baseUrl")}/api/v1/customer`;
const verb = "GET";
const body = { cpf: "58037125076" };

describe("GET /api/v1/customer/address", () => {
    it("CPF Válido", () => {
        realizarRequisicao(body);

        validacaoStatus(200);
    });

    it("CPF válido porém não cadastrado", () => {
        const payload = body;
        payload.cpf = "91833315065";

        realizarRequisicao(payload);

        validacaoStatus(404);

        cy.get("@consultaCliente").then(response => {
            expect(response.body).to.contain(`Cliente não encontrado`);
        });
    });

    it("CPF contendo letras", () => {
        const payload = body;
        payload.cpf = "9183331506A";
        
        realizarRequisicao(payload);

        validacaoStatus(502);

        cy.get("@consultaCliente").then(response => {
            expect(response.body).to.contain(`Erro interno`);
        });
    });

    it("CPF inexistente", () => {
        const payload = body;
        payload.cpf = null;

        realizarRequisicao(payload);

        validacaoStatus(400);

        cy.get("@consultaCliente").then(response => {
            expect(response.body).to.contain(`Campo cpf não informado`);
        });
    });

    it("CPF com 12 caracteres", () => {
        const payload = body;
        payload.cpf = "918333150654";

        realizarRequisicao(payload);

        validacaoStatus(400);

        cy.get("@consultaCliente").then(response => {
            expect(response.body).to.contain(`Campo CPF deve conter 11 dígitos`);
        });
    });

    it("CPF com 10 caracteres", () => {
        const payload = body;
        payload.cpf = "9183331506";

        realizarRequisicao(payload);

        validacaoStatus(400);

        cy.get("@consultaCliente").then(response => {
            expect(response.body).to.contain(`Campo CPF deve conter 11 dígitos`);
        });
    })
});

function realizarRequisicao(payload) {
    cy.request(verb, url, payload).as("consultaCliente");
}

function validacaoStatus(status) {
    cy.get("@consultaCliente")
        .its("status")
        .should("equal", status);
}