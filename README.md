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

| ID     | Funcionalidade          | Pré-Condição                   | Passos | Dados de Entrada | Resultado Esperado | Resultado Obtido | Status | Observações |
|--------|-------------------------|--------------------------------|--------|------------------|--------------------|------------------|--------|-------------|
| **FT-01** | Geração Plano Low Carb | Token válido | 1. POST `/planos` 2. Enviar JSON 3. Validar resposta | `{"dieta":"Low Carb","alergias":"Ovo,Glúten","preferencia":"Pão,Queijo"}` | Plano sem ovos/glúten e sem pão | Plano removeu ovos mas manteve pão | ❌ | **Bug**: Glúten não filtrado |
| **FT-02** | Plano Vegetariano | Usuário com IMC > 25 | 1. Enviar request 2. Verificar calorias | `{"dieta":"Vegetariana","peso":90,"altura":180}` | Plano com deficit calórico (máx 1500kcal/dia) | Plano com 1200kcal/dia | ✅ | |
| **FT-03** | Dieta Cetogênica | Alergia a frutos do mar | 1. Enviar request 2. Verificar gorduras | `{"dieta":"Cetogênica","alergias":"Frutos do mar","preferencia":"Salmão"}` | Plano com >70% gorduras, sem frutos do mar | Plano com 75% gorduras | ✅ | Salmão permitido |
| **FT-04** | Validação Mediterrânea | Preferência por carboidratos | 1. Enviar request 2. Verificar balanço nutricional | `{"dieta":"Mediterrânea","preferencia":"Macarrão,Azeite"}` | Macarrão controlado (≤100g/dia) | Macarrão excedeu limite (120g/dia) | ❌ | **Bug**: Controle de porções |
| **FT-05** | Tratamento de Erros | Dados incompletos | 1. Enviar request sem peso 2. Verificar resposta | `{"dieta":"Low Carb","altura":170}` | Erro 400 com mensagem de campo obrigatório | Status 400 retornado | ✅ | |
| **FT-06** | Dieta sem Restrições | Sem alergias/preferências | 1. Enviar request mínimo 2. Verificar estrutura | `{"dieta":"Mediterrânea","peso":70,"altura":170}` | Plano padrão com 5 refeições/dia | Estrutura correta | ✅ | |

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
