# NutriFácil - Sistema de Planejamento Alimentar Personalizado

## Descrição do Projeto
NutriFácil é uma solução completa para planejamento alimentar personalizado, desenvolvida para auxiliar usuários a montar seus planos alimentares conforme suas preferências, objetivos e restrições. O sistema oferece cálculos de TMB, IMC e consumo de água, além de gerar recomendações alimentares ajustadas à dieta selecionada.

---

## Funcionalidades Principais

- Seleção de dietas: Mediterrânea, Low Carb, Cetogênica e Vegetariana.
- Cálculo automático de:
  - Taxa Metabólica Basal (TMB) usando fórmula de Mifflin.
  - Índice de Massa Corporal (IMC) com classificação.
  - Consumo diário recomendado de água.
- Recomendações alimentares personalizadas com base na dieta e preferências do usuário.
- Gerenciamento de restrições alimentares (alergias e intolerâncias).
- Registro, consulta e atualização de perfis de usuários.
- Integração com API da OpenAI para geração avançada de planos alimentares.
- Integração com Mercado Pago para processamento de pagamentos.
- API RESTful organizada e documentada.
- Logs para monitoramento e tratamento de erros.
- Arquitetura modular e escalável.

---

## Tecnologias Utilizadas

- Node.js
- Express.js
- MongoDB com Mongoose
- OpenAI API
- Mercado Pago SDK
- dotenv para gerenciar variáveis de ambiente
- Winston para logging

---

## Estrutura do Projeto

```
/EASYBUTRI-BACK
├── /config              # Configurações do sistema e conexões
├── /controllers         # Controladores para as rotas da aplicação
├── /middleware          # Middlewares para autenticação, erros e pagamentos
├── /models              # Modelos de dados MongoDB
├── /routes              # Definição das rotas da API
├── /services            # Serviços de negócio, integração com APIs externas
├── /utils               # Utilitários, helpers e validadores
├── /logs                # Arquivos de log gerados pela aplicação
├── app.js               # Arquivo principal da aplicação
├── .env                 # Variáveis de ambiente (não versionar)
├── package.json         # Dependências do projeto
└── README.md            # Documentação do projeto
```

## Configuração do Ambiente

1. Clone este repositório:

```
git clone <https://github.com/byasun/EasyNutri-back.git>
cd EASYBUTRI-BACK
```

2. Instale as dependências:

```
npm install
```

3. Configure as variáveis de ambiente no arquivo `.env`. Exemplo:

```
PORT=3000
MONGODB_URI=seu_string_de_conexao_mongodb
OPENAI_API_KEY=sua_chave_openai
MERCADOPAGO_ACCESS_TOKEN=seu_token_mercadopago
NODE_ENV=development
```

4. Inicie o servidor:

```
npm start
```

---

## Endpoints Principais

| Método | Rota                    | Descrição                                         |
|--------|-------------------------|---------------------------------------------------|
| POST   | /calculations/tmb       | Calcula a Taxa Metabólica Basal (TMB)             |
| POST   | /calculations/imc       | Calcula o Índice de Massa Corporal (IMC)          |
| POST   | /calculations/water     | Calcula consumo diário de água                    |
| POST   | /diets/recommendation   | Gera recomendação alimentar baseada no perfil     |
| GET    | /diets/:type            | Busca informações detalhadas de uma dieta         |
| POST   | /users                  | Cria novo usuário                                 |
| GET    | /users/:id              | Consulta usuário por ID                           |
| PUT    | /users/:id              | Atualiza dados do usuário                         |
| POST   | /payments/initiate      | Inicia pagamento via Mercado Pago                 |
| POST   | /payments/notification  | Recebe notificações de pagamento do Mercado Pago  |

---
## Casos de Teste

| ID     | Funcionalidade          | Pré-Condição                          | Passos                                                                 | Dados de Entrada                                                                                                                                 | Resultado Esperado                                                                                     | Resultado Obtido | Status  | Observações                     |
|--------|-------------------------|---------------------------------------|-----------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|------------------|---------|---------------------------------|
| **FT-01** | Geração de Plano Low Carb | Usuário autenticado, dados cadastrais completos | 1. Acessar endpoint `/gerar-plano`2. Enviar JSON de entrada3. Validar resposta | `{dieta: "Low Carb", peso: 96, altura: 180, idade: 20, sexo: "homem", alergias: "Ovo", preferencia: "Melancia,Nabo,Pão", objetivo: "Emagrecimento"}` | Plano sem ovos, com ≤50g carboidratos/dia, ignorando "Pão" (incompatível)                              |                  |         | Testar substituição de ovos     |
| **FT-02** | Geração de Plano Vegetariano | Usuário com alergias registradas      | 1. Enviar request com alergias2. Verificar filtros                | `{dieta: "Vegetariana", alergias: "Leite,Glúten", preferencia: "Queijo,Peixe,Cenoura", ...}`                                                      | Plano sem carne/peixe/laticínios/glúten, ignorando "Queijo" e "Peixe", incluindo "Cenoura"            |                  |         | Validar conflitos de preferência |
| **FT-03** | Geração de Plano Mediterrâneo | Usuário com alergia a frutos do mar   | 1. Enviar request<br>2. Verificar inclusão de peixes permitidos       | `{dieta: "Mediterrânea", alergias: "Frutos do mar", preferencia: "Macarrão,Salmão,Azeite", ...}`                                                 | Plano sem frutos do mar, com "Salmão" permitido e "Macarrão" controlado                                |                  |         | Salmão ≠ fruto do mar           |
| **FT-04** | Geração de Plano Cetogênico | Usuário com alergia a amendoim        | 1. Enviar request<br>2. Verificar restrição de carboidratos           | `{dieta: "Cetogênica", alergias: "Amendoim", preferencia: "Batata-Doce,Queijo,Ovos", ...}`                                                       | Plano sem amendoim, ignorando "Batata-Doce" (alta em carbos), incluindo "Queijo" e "Ovos" se permitido |                  |         |                                 |
| **FT-05** | Validação de Campos       | Usuário não autenticado               | 1. Enviar request sem token<br>2. Tentar gerar plano                  | `{dieta: "Low Carb", ...}` (sem token)                                                                                                           | Erro 401 (Não autorizado)                                                                             |                  |         | Testar segurança da API         |

---

## Cenários Gherkin

```
Cenário: Usuário escolhe genero 
Dado: Que o usuário seleciona o gênero masculino	 
Quando: O usuário clicar no ícone masculino 
Então: O sistema avança para o próximo passo  
E: Salva masculino no user data 


Cenario: Usuário escolhe tipo de dieta 
Dado: O usuário escolhe a dieta low carb 
Quando: O usuário clicar no botão da dieta low carb 
Então: Salva a informão so user data  
E: Avança para a próxima tela 

 
Cenario: Usuário digita o peso 
Dado: Que o usuário digite o peso de 70kg  
Quando: O usuário clicar no botão  proximo 
Então: Salva o peso no user data  
E: Avança para próxima tela 

 
Cenario: Usuário digita altura  
Dado: Que o usuário digite a altura de 179 cm 
Quando: Clicar no botão próximo  
Então: O sistema salva no user data  
E: Avança para a próxima tela 

 
Cenario: Usuário escolhe alergia a leite 
Dado: Que o usuário escolha a alergia a leite  
Quando: Selecionar a caixa de alergia a leite  
Então: Salva no user data a alergia a leite  
E: Ignora as outras alergias  

 
Cenário: Usuário confirma pagamento 
Dado: Que o usuário completou o teste  
Quando: Ele concluir o checkout 
Então: Envia a mensagem de agradecimento 
E: O PDF com a dieta completa
```

---
## Boas Práticas e Observações

- Todas as requisições devem enviar dados no formato JSON.
- As rotas protegidas requerem autenticação com token JWT.
- As integrações externas (OpenAI e Mercado Pago) usam variáveis de ambiente para configuração.
- O sistema registra logs detalhados em `/logs` para facilitar o monitoramento e debug.

---

## Contato

Para dúvidas ou contribuições, entre em contato com a equipe do projeto.

- Anna Clara - byasun
- Gabriel Bernardes - Gabber28
- Lucas Ramos - LucasRramos

---

## Licença

Este projeto está licenciado sob a licença MIT.
