/// <reference types="cypress" />

const url = `${Cypress.config("baseUrl")}/api/v1/customer`;
const verb = "POST";
const body = {
    customer: {
        address: {
            zipCode: 3092902,
            street: "Av. Iguatemi",
            number: 13,
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
            realizarRequisicao(body);

            validacaoStatus(201);
        });
    });

    context("Validação do CEP", () => {    
        it("CEP com 7 caracteres", () => {
            const payload = body;
            payload.address.zipCode = "1309290";
    
            realizarRequisicao(payload);
    
            validacaoStatus(400);
            validacaoCampoInvalido("zipCode");
        });
    
        it("CEP com 9 caracteres", () => {
            const payload = body;
            payload.address.zipCode = "130929021";
    
            realizarRequisicao(payload);
    
            validacaoStatus(400);
            validacaoCampoInvalido("zipCode");
        });
    
        it("CEP com letras", () => {
            const payload = body;
            payload.address.zipCode = "13092902A";
    
            realizarRequisicao(payload);
    
            validacaoStatus(400);
            validacaoCampoInvalido("zipCode");
        });
    
        it("CEP inexistente", () => {
            const payload = body;
            payload.address.zipCode = null;
    
            realizarRequisicao(payload);
    
            validacaoStatus(400);
            validacaoCampoInexistente("zipCode");
        });
    });

    context("Validação da Rua", () => {
        it("Rua com 61 caracteres", () => {
            const payload = body;
            payload.address.street = "Av. Iguatemi AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

            realizarRequisicao(payload);

            validacaoStatus(400);
            validacaoCampoInvalido("street");
        });

        it("Rua inexistente", () => {
            const payload = body;
            payload.address.street = null;

            realizarRequisicao(payload);

            validacaoStatus(400);
            validacaoCampoInexistente("street");
        });
    });

    context("Validação do Número", () => {
        it("Número inexistente", () => {
            const payload = body;
            payload.address.number = null;

            realizarRequisicao(payload);

            validacaoStatus(400);
            validacaoCampoInexistente("number");
        });
    });

    context("Validação do Complemento", () => {
        it("Complemento com 41 caracteres", () => {
            const payload = body;
            payload.address.complement = "Apto 68 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

            realizarRequisicao(payload);

            validacaoStatus(400);
            validacaoCampoInvalido("complement");
        });
    });

    context("Validação da Data de Nascimento", () => {
        it("Data de Nacimento sendo 01/01/2015", () => {
            const payload = body;
            payload.birthDate = "2015-01-01";

            realizarRequisicao(payload);

            validacaoStatus(412);
            
            cy.get("@cadastroCliente").then(response => {
                expect(response.body).to.contain("Permitido o cadastro somente para maiores de 16 anos");
            });
        });

        it("Data de Nascimento sendo 01/01/2025", () => {
            const payload = body;
            payload.birthDate = "2025-01-01";

            realizarRequisicao(payload);

            validacaoStatus(412);

            cy.get("@cadastroCliente").then(response => {
                expect(response.body).to.contain("Data de Nascimento não deve ser maior que a atual");
            });
        });

        it("Data de Nacimento inexistente", () => {
            const payload = body;
            payload.birthDate = null;

            realizarRequisicao(payload);

            validacaoStatus(400);
            validacaoCampoInexistente("birthDate");
        });
    });

    context("Validação do CPF", () => {
        it("CPF com 10 caracteres", () => {
            const payload = body;
            payload.cpf = "5803712507"

            realizarRequisicao(payload);

            validacaoStatus(400);
            cy.get("@cadastroCliente").then(response => {
                expect(response.body).to.contain("Campo CPF deve conter 11 dígitos");
            });
        });

        it("CPF contendo 12 caracteres", () => {
            const payload = body;
            payload.cpf = "580371250761";

            realizarRequisicao(payload);

            validacaoStatus(400);
            cy.get("@cadastroCliente").then(response => {
                expect(response.body).to.contain("Campo CPF deve conter 11 dígitos");
            });
        });

        it("CPF inexistente", () => {
            const payload = body;
            payload.cpf = null;

            realizarRequisicao(payload);

            validacaoStatus(400);
            validacaoCampoInexistente("cpf");
        });

        it("CPF de cliente já cadastrado", () => {
            realizarRequisicao(body);

            validacaoStatus(412);

            cy.get("@cadastroCliente").then(response => {
                expect(response.body).to.contain("Cliente já cadastrado");
            });
        });

        it("CPF contendo letras", () => {
            const payload = body;
            payload.cpf = "5803712507A";

            realizarRequisicao(payload);

            validacaoStatus(400);
            validacaoCampoInvalido("cpf");
        });

        it("CPF com dígito verificador inválido", () => {
            const payload = body;
            payload.cpf = "12345678912";

            realizarRequisicao(payload);

            validacaoStatus(400);
            validacaoCampoInvalido("cpf");
        });
    });

    context("Validação do Nome", () => {
        it("Nome contendo 101 caracteres", () => {
            const payload = body;
            payload.name = "Jose da Silvaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

            realizarRequisicao(payload);

            validacaoStatus(400);
            validacaoCampoInvalido("name");
        });

        it("Nome inexistente", () => {
            const payload = body;
            payload.name = null;

            realizarRequisicao(payload);

            validacaoStatus(400);
            validacaoCampoInexistente("name");
        });
    });
});

function realizarRequisicao(payload) {
    cy.request(verb, url, payload).as("cadastroCliente");
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