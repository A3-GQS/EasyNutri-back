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

# Resultados do Questionário de Usabilidade – Nutrifácil

## 🧾 Participante 1

### Dados do Participante

- **Nome / Código:** Participante001  
- **Data:** 15/06/2025  
- **Moderador:** Gabriel Bernardes  
- **Dispositivo / Navegador:** Desktop / Chrome  

### Tarefas

| Nº | Descrição da Tarefa                               | Tempo Alvo | Tempo Real (s) | Sucesso (S/N) | Erros / Dificuldades                | Observações do Usuário            |
|----|---------------------------------------------------|------------|----------------|---------------|-------------------------------------|-----------------------------------|
| 1  | Selecionar a dieta “Low Carb”                     | 30 s       | 28             | S             | Nenhum                              | Interface clara                   |
| 2  | Informar peso, altura e idade                     | 60 s       | 50             | S             | Nenhum                              | Tudo fácil de localizar           |
| 3  | Escolher 3 alimentos que não come em cada categoria| 45 s      | 47             | S             | Confusão com categoria de legumes   | Poderia ter exemplos              |
| 4  | Identificar onde registrar alergias/intolerâncias | 30 s       | 35             | S             | Demorou a encontrar                 | Ícone pouco visível               |
| 5  | Gerar o plano alimentar e visualizar recomendações| 60 s       | 65             | S             | Leve lentidão                       | Visual bem organizado             |

### Métricas de Satisfação

| Critério                      | Nota (1–5) | Comentários                        |
|-------------------------------|------------|-------------------------------------|
| Facilidade de navegação       | 4          | Apenas uma etapa gerou dúvidas     |
| Clareza das instruções        | 5          | Muito claras                       |
| Velocidade de resposta        | 4          | Um pouco lento no final            |
| Layout e design               | 5          | Interface agradável                |
| Confiança ao usar a ferramenta| 5          | Muito confiável                    |

---

## 🧾 Participante 2

### Dados do Participante

- **Nome / Código:** Participante002  
- **Data:** 15/06/2025  
- **Moderador:** Anna Clara  
- **Dispositivo / Navegador:** Smartphone / Safari  

### Tarefas

| Nº | Descrição da Tarefa                               | Tempo Alvo | Tempo Real (s) | Sucesso (S/N) | Erros / Dificuldades            | Observações do Usuário         |
|----|---------------------------------------------------|------------|----------------|---------------|---------------------------------|--------------------------------|
| 1  | Selecionar a dieta “Cetogênica”                   | 30 s       | 32             | S             | Botão difícil de achar          | Poderia estar mais visível     |
| 2  | Informar peso, altura e idade                     | 60 s       | 60             | S             | Teclado cobriu campo            | Resolver com rolagem automática|
| 3  | Escolher 3 alimentos que não come em cada categoria| 45 s      | 48             | S             | Nenhum                          | Tudo tranquilo                  |
| 4  | Identificar onde registrar alergias/intolerâncias | 30 s       | 30             | S             | Nenhum                          | Simples de encontrar           |
| 5  | Gerar o plano alimentar e visualizar recomendações| 60 s       | 63             | S             | Leve lentidão                   | Layout adaptado ao celular     |

### Métricas de Satisfação

| Critério                      | Nota (1–5) | Comentários                          |
|-------------------------------|------------|---------------------------------------|
| Facilidade de navegação       | 3          | Um pouco confuso no celular           |
| Clareza das instruções        | 4          | Boas instruções                       |
| Velocidade de resposta        | 3          | Poderia ser mais ágil                 |
| Layout e design               | 4          | Adequado                             |
| Confiança ao usar a ferramenta| 4          | Boa, mas poderia melhorar             |

---

## 🧾 Participante 3

### Dados do Participante

- **Nome / Código:** Participante003  
- **Data:** 16/06/2025  
- **Moderador:** Lucas Rodrigues  
- **Dispositivo / Navegador:** Notebook / Firefox  

### Tarefas

| Nº | Descrição da Tarefa                               | Tempo Alvo | Tempo Real (s) | Sucesso (S/N) | Erros / Dificuldades         | Observações do Usuário        |
|----|---------------------------------------------------|------------|----------------|---------------|-------------------------------|-------------------------------|
| 1  | Selecionar a dieta “Mediterrânea”                 | 30 s       | 26             | S             | Nenhum                        | Intuitivo                     |
| 2  | Informar peso, altura e idade                     | 60 s       | 55             | S             | Nenhum                        | Campos bem identificados      |
| 3  | Escolher 3 alimentos que não come em cada categoria| 45 s      | 42             | S             | Nenhum                        | Interface clara               |
| 4  | Identificar onde registrar alergias/intolerâncias | 30 s       | 27             | S             | Nenhum                        | Fácil de achar                |
| 5  | Gerar o plano alimentar e visualizar recomendações| 60 s       | 58             | S             | Nenhum                        | Carregou rápido               |

### Métricas de Satisfação

| Critério                      | Nota (1–5) | Comentários                  |
|-------------------------------|------------|-------------------------------|
| Facilidade de navegação       | 5          | Muito fácil                  |
| Clareza das instruções        | 5          | Perfeitas                    |
| Velocidade de resposta        | 5          | Rápido                       |
| Layout e design               | 5          | Muito bonito                 |
| Confiança ao usar a ferramenta| 5          | Transmite segurança          |

---

## 🧾 Participante 4

### Dados do Participante

- **Nome / Código:** Participante004  
- **Data:** 16/06/2025  
- **Moderador:** Gabriel Bernardes  
- **Dispositivo / Navegador:** Tablet / Edge  

### Tarefas

| Nº | Descrição da Tarefa                               | Tempo Alvo | Tempo Real (s) | Sucesso (S/N) | Erros / Dificuldades             | Observações do Usuário      |
|----|---------------------------------------------------|------------|----------------|---------------|----------------------------------|-----------------------------|
| 1  | Selecionar a dieta “Vegetariana”                  | 30 s       | 31             | S             | Confusão entre nomes parecidos   | Destacar nomes ajuda        |
| 2  | Informar peso, altura e idade                     | 60 s       | 58             | S             | Nenhum                            | Layout ajustado             |
| 3  | Escolher 3 alimentos que não come em cada categoria| 45 s      | 50             | S             | Alimentos mal categorizados      | Adicionar exemplos visuais  |
| 4  | Identificar onde registrar alergias/intolerâncias | 30 s       | 29             | S             | Nenhum                            | Intuitivo                   |
| 5  | Gerar o plano alimentar e visualizar recomendações| 60 s       | 61             | S             | Um pequeno atraso                 | Funciona bem em tablet      |

### Métricas de Satisfação

| Critério                      | Nota (1–5) | Comentários                    |
|-------------------------------|------------|---------------------------------|
| Facilidade de navegação       | 4          | Poderia destacar mais as opções|
| Clareza das instruções        | 5          | Muito claras                   |
| Velocidade de resposta        | 4          | Pequeno atraso                 |
| Layout e design               | 4          | Bonito                         |
| Confiança ao usar a ferramenta| 5          | Passa segurança                |

---

## 🧾 Participante 5

### Dados do Participante

- **Nome / Código:** Participante005  
- **Data:** 17/06/2025  
- **Moderador:** Anna Clara  
- **Dispositivo / Navegador:** Desktop / Opera  

### Tarefas

| Nº | Descrição da Tarefa                               | Tempo Alvo | Tempo Real (s) | Sucesso (S/N) | Erros / Dificuldades              | Observações do Usuário           |
|----|---------------------------------------------------|------------|----------------|---------------|-----------------------------------|----------------------------------|
| 1  | Selecionar a dieta “Low Carb”                     | 30 s       | 27             | S             | Nenhum                            | Tudo direto                      |
| 2  | Informar peso, altura e idade                     | 60 s       | 49             | S             | Nenhum                            | Preenchimento fácil              |
| 3  | Escolher 3 alimentos que não come em cada categoria| 45 s      | 43             | S             | Dúvida sobre uma categoria        | Podia ter exemplo na tela        |
| 4  | Identificar onde registrar alergias/intolerâncias | 30 s       | 32             | S             | Nenhum                            | Muito claro                      |
| 5  | Gerar o plano alimentar e visualizar recomendações| 60 s       | 60             | S             | Nenhum                            | Plano gerado com clareza         |

### Métricas de Satisfação

| Critério                      | Nota (1–5) | Comentários                     |
|-------------------------------|------------|----------------------------------|
| Facilidade de navegação       | 5          | Muito fácil                     |
| Clareza das instruções        | 4          | Boas, mas poderia ter exemplo   |
| Velocidade de resposta        | 5          | Sem atrasos                     |
| Layout e design               | 5          | Ótima estética                  |
| Confiança ao usar a ferramenta| 5          | Transmite confiança             |

---

## 🧾 Participante 6

### Dados do Participante

- **Nome / Código:** Participante006  
- **Data:** 17/06/2025  
- **Moderador:** Lucas Rodrigues  
- **Dispositivo / Navegador:** Notebook / Chrome  

### Tarefas

| Nº | Descrição da Tarefa                               | Tempo Alvo | Tempo Real (s) | Sucesso (S/N) | Erros / Dificuldades         | Observações do Usuário     |
|----|---------------------------------------------------|------------|----------------|---------------|-------------------------------|----------------------------|
| 1  | Selecionar a dieta “Cetogênica”                   | 30 s       | 30             | S             | Nenhum                        | Navegação fluida           |
| 2  | Informar peso, altura e idade                     | 60 s       | 52             | S             | Nenhum                        | Preenchimento tranquilo    |
| 3  | Escolher 3 alimentos que não come em cada categoria| 45 s      | 44             | S             | Nenhum                        | Tudo intuitivo             |
| 4  | Identificar onde registrar alergias/intolerâncias | 30 s       | 30             | S             | Nenhum                        | Bem sinalizado             |
| 5  | Gerar o plano alimentar e visualizar recomendações| 60 s       | 59             | S             | Nenhum                        | Sem problemas              |

### Métricas de Satisfação

| Critério                      | Nota (1–5) | Comentários                 |
|-------------------------------|------------|------------------------------|
| Facilidade de navegação       | 5          | Intuitivo                   |
| Clareza das instruções        | 5          | Tudo explicado              |
| Velocidade de resposta        | 5          | Muito bom                   |
| Layout e design               | 5          | Esteticamente agradável     |
| Confiança ao usar a ferramenta| 5          | Sistema confiável           |

---

## 🧾 Participante 7

### Dados do Participante

- **Nome / Código:** Participante007  
- **Data:** 18/06/2025  
- **Moderador:** Gabriel Bernardes  
- **Dispositivo / Navegador:** Smartphone / Firefox  

### Tarefas

| Nº | Descrição da Tarefa                               | Tempo Alvo | Tempo Real (s) | Sucesso (S/N) | Erros / Dificuldades        | Observações do Usuário     |
|----|---------------------------------------------------|------------|----------------|---------------|------------------------------|----------------------------|
| 1  | Selecionar a dieta “Mediterrânea”                 | 30 s       | 29             | S             | Nenhum                       | Layout adaptado            |
| 2  | Informar peso, altura e idade                     | 60 s       | 55             | S             | Nenhum                       | Preenchimento rápido       |
| 3  | Escolher 3 alimentos que não come em cada categoria| 45 s      | 46             | S             | Nenhum                       | Fácil de navegar           |
| 4  | Identificar onde registrar alergias/intolerâncias | 30 s       | 28             | S             | Nenhum                       | Muito claro                |
| 5  | Gerar o plano alimentar e visualizar recomendações| 60 s       | 62             | S             | Leve lentidão no celular     | Recomendável               |

### Métricas de Satisfação

| Critério                      | Nota (1–5) | Comentários                   |
|-------------------------------|------------|--------------------------------|
| Facilidade de navegação       | 4          | Leve confusão no início       |
| Clareza das instruções        | 5          | Muito claras                  |
| Velocidade de resposta        | 4          | Carregamento aceitável        |
| Layout e design               | 5          | Design bom mesmo no celular   |
| Confiança ao usar a ferramenta| 5          | Muito confiável               |

---

## 🧾 Participante 8

### Dados do Participante

- **Nome / Código:** Participante008  
- **Data:** 18/06/2025  
- **Moderador:** Anna Clara  
- **Dispositivo / Navegador:** Desktop / Edge  

### Tarefas

| Nº | Descrição da Tarefa                               | Tempo Alvo | Tempo Real (s) | Sucesso (S/N) | Erros / Dificuldades       | Observações do Usuário     |
|----|---------------------------------------------------|------------|----------------|---------------|-----------------------------|----------------------------|
| 1  | Selecionar a dieta “Vegetariana”                  | 30 s       | 30             | S             | Nenhum                      | Bem organizado             |
| 2  | Informar peso, altura e idade                     | 60 s       | 56             | S             | Nenhum                      | Fácil preenchimento        |
| 3  | Escolher 3 alimentos que não come em cada categoria| 45 s      | 46             | S             | Nenhum                      | Processo tranquilo         |
| 4  | Identificar onde registrar alergias/intolerâncias | 30 s       | 30             | S             | Nenhum                      | Sinalização clara          |
| 5  | Gerar o plano alimentar e visualizar recomendações| 60 s       | 63             | S             | Leve demora                 | Conteúdo útil              |

### Métricas de Satisfação

| Critério                      | Nota (1–5) | Comentários              |
|-------------------------------|------------|---------------------------|
| Facilidade de navegação       | 5          | Muito simples             |
| Clareza das instruções        | 5          | Extremamente claras       |
| Velocidade de resposta        | 4          | Leve atraso               |
| Layout e design               | 5          | Muito agradável           |
| Confiança ao usar a ferramenta| 5          | Passa segurança total     |


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
