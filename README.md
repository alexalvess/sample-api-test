# O que é este projeto?
Este projeto é uma automação de testes focados em API. Todos os testes foram desenvolvidos de acordo com as informações contidas no [documento](./especificacao.pdf).

## Proposta:
Validar campos enviados, via payload, em dois endpoints referente a Cadastro de Cliente (com verbo POST) e Consulta de Endereço de Cliente (com verbo GET).

## Cenários de teste identificados:
Funcionalidade | Cenário | Status esperado | Mensagem esperada
-|-|-|-
Cadastro de Cliente | Todos os campos válidos | 201 | -
Cadastro de Cliente | CEP com 7 caracteres | 400 | Campo zipCode inválido
Cadastro de Cliente | CEP com 9 caracteres | 400 | Campo zipCode inválido
Cadastro de Cliente | CEP contendo Letras | 400 | Campo zipCode inválido
Cadastro de Cliente | CEP inexistente | 400 | Campo zipCode não informado 
Cadastro de Cliente | Rua contendo 61 caracteres | 400 | Campo zipCode inválido
Cadastro de Cliente | Rua inexistente | 400 | Campo street não informado
Cadastro de Cliente | Número inexistente | 400 | Campo number não informado
Cadastro de Cliente | Complemento contendo 41 caracteres | 400 | Campo complement inválido
Cadastro de Cliente | Data de nascimento sendo 01/01/2015 | 412 | Permitido o cadastro somente para maiores de 16 anos
Cadastro de Cliente | Data de nascimento sendo 01/01/2025 | 412 | Data de Nascimento não deve ser maior que a atual
Cadastro de Cliente | Data de nascimento inexistente | 400 | Campo birthDate não informado
Cadastro de Cliente | CPF contendo 10 caracteres | 400 | Campo CPF deve conter 11 dígitos
Cadastro de Cliente | CPF contendo 12 caracteres | 400 | Campo CPF deve conter 11 dígitos
Cadastro de Cliente | CPF inexistente | 400 | Campo cpf não informado
Cadastro de Cliente | CPF já existente | 412 | Cliente já cadastrado
Cadastro de Cliente | CPF contendo letras | 400 | Campo cpf inválido
Cadastro de Cliente | CPF com dígito verificador inválido | 400 | Campo cpf inválido
Cadastro de Cliente | Nome contendo 101 caracteres | 400 | Campo name inválido
Cadastro de Cliente | Nome inexistente | 400 | Campo name não informado
Busca por cliente | CPF contendo 10 caracteres | 400 | Campo CPF deve conter 11 dígitos
Busca por cliente | CPF contendo 12 caracteres | 400 | Campo CPF deve conter 11 dígitos
Busca por cliente | CPF inexistente | 400 | Campo cpf não informado
Busca por cliente | CPF contendo letras | 502 | Erro interno
Busca por cliente | CPF válido e  não cadastrado | 404 | Cliente não encontrado
Busca por cliente | CPF válido e cadastrado | 200 | "CORPO DO RESPONSE"

Todos os testes realizados estão em ./cypress/integration/cliente

## Tecnologias:
* Cypress v6.0.0
* Javascript
* NPM (instalador de pacotes)

## Como executar/utilizar?
* Tenha alguma ferramenta do Git instalado, como o [GitBash](https://git-scm.com/downloads)
* Tenha instalado alguma IDE como o [Visual Studio Code](https://code.visualstudio.com/download)
* Tenha instalado o [NodeJs](https://nodejs.org/en/download/)
* Baixe o repositório, via GitBash, para alguma pasta:
    * git clone URL_DO_PROJETO
* Abra o projeto pelo Visual Studio Code
* Execute os comandos no terminal:
    * npm install
    * npm run cy:open
