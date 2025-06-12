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

## Configuração do Ambiente

1. Clone este repositório:

git clone <https://github.com/byasun/EasyNutri-back.git>
cd EASYBUTRI-BACK

2. Instale as dependências:

npm install

3. Configure as variáveis de ambiente no arquivo `.env`. Exemplo:

PORT=3000
MONGODB_URI=seu_string_de_conexao_mongodb
OPENAI_API_KEY=sua_chave_openai
MERCADOPAGO_ACCESS_TOKEN=seu_token_mercadopago
NODE_ENV=development

4. Inicie o servidor:

npm start

---

## Endpoints Principais

| Método | Rota                    | Descrição                                       |
|--------|-------------------------|------------------------------------------------|
| POST   | /calculations/tmb       | Calcula a Taxa Metabólica Basal (TMB)           |
| POST   | /calculations/imc       | Calcula o Índice de Massa Corporal (IMC)        |
| POST   | /calculations/water     | Calcula consumo diário de água                    |
| POST   | /diets/recommendation   | Gera recomendação alimentar baseada no perfil   |
| GET    | /diets/:type            | Busca informações detalhadas de uma dieta        |
| POST   | /users                  | Cria novo usuário                                |
| GET    | /users/:id              | Consulta usuário por ID                           |
| PUT    | /users/:id              | Atualiza dados do usuário                         |
| POST   | /payments/initiate      | Inicia pagamento via Mercado Pago                 |
| POST   | /payments/notification  | Recebe notificações de pagamento do Mercado Pago |

---

## Testes

Ainda em desenvolvimento. Recomendamos criar testes unitários e de integração para garantir a qualidade do sistema.

---

## Boas Práticas e Observações

- Todas as requisições devem enviar dados no formato JSON.
- As rotas protegidas requerem autenticação com token JWT.
- As integrações externas (OpenAI e Mercado Pago) usam variáveis de ambiente para configuração.
- O sistema registra logs detalhados em `/logs` para facilitar o monitoramento e debug.
- Documente todas as alterações e mantenha o README atualizado para melhor manutenção colaborativa.

---

## Apresentação

Para apresentar o projeto, recomendamos a estrutura dos slides:

1. Introdução
2. Motivação
3. Desenvolvimento
4. Resultados
5. Considerações Finais

---

## Contato

Para dúvidas ou contribuições, entre em contato com a equipe do projeto.

---

## Licença

Este projeto está licenciado sob a licença MIT.
