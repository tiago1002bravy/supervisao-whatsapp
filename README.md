# supervisao-atendimento

Backend de supervisão de atendimento via WhatsApp com análise de risco automatizada por IA.

## Funcionalidades

- **Ingestão de mensagens** via webhook UazAPI (texto e áudio transcrito por Whisper)
- **Análise de risco automática** a cada 30 minutos via GPT-4.5
- **Relatórios de risco** por cliente armazenados no banco
- **Integração Google Drive/Docs** para leitura de Google Docs dentro das pastas `meet records` da equipe
- **Health check** em `GET /health`

## Stack

- NestJS 11 + TypeScript
- PostgreSQL + TypeORM (migrations)
- OpenAI (Whisper + GPT-4.5)
- Google APIs (Drive + Docs)
- UazAPI (WhatsApp)

## Estrutura

```
src/
  analysis/       job de análise de risco (cron 30min → GPT → risk_reports)
  clients/        CRUD de clientes
  common/         guards, filtros, interceptors, middleware
  config/         validação de variáveis de ambiente
  database/       data source + migrations
  google/         integração Drive e Docs
  health/         health check endpoint
  whatsapp/       webhook UazAPI + ingestão de mensagens
```

## Configuração

```bash
cp .env.example .env
# preencher as variáveis
```

Variáveis obrigatórias:
| Variável | Descrição |
|---|---|
| `DATABASE_URL` | Connection string PostgreSQL |
| `UAZAPI_BASE_URL` | URL da instância UazAPI |
| `UAZAPI_TOKEN` | Token de autenticação UazAPI |
| `UAZAPI_WEBHOOK_SECRET` | Secret para validar webhooks |
| `OPENAI_API_KEY` | Chave OpenAI (Whisper + GPT) |

Variáveis opcionais (Google):
| Variável | Descrição |
|---|---|
| `GOOGLE_SERVICE_ACCOUNT_KEY` | JSON da service account (em uma linha) |
| `GOOGLE_IMPERSONATE_EMAIL` | E-mail do usuário a impersonar |
| `GOOGLE_TEAM_ROOT_FOLDER_ID` | ID da pasta raiz da equipe a ser varrida |

Observações para Google:
- A service account precisa de Domain-Wide Delegation.
- Drive API e Docs API devem estar habilitadas.
- O usuário informado em `GOOGLE_IMPERSONATE_EMAIL` precisa ter acesso à pasta raiz da equipe e aos Shared Drives envolvidos.
- O polling busca recursivamente por pastas chamadas `meet records` e lê apenas arquivos Google Docs dentro delas.

## Desenvolvimento

```bash
yarn install
yarn start:dev
```

## Banco de dados

```bash
# Gerar migration a partir das entidades
yarn migration:generate src/database/migrations/nome

# Aplicar migrations
yarn migration:run

# Reverter última migration
yarn migration:revert
```

## Rotas

| Método | Rota | Descrição |
|---|---|---|
| GET | `/health` | Status da aplicação e banco |
| GET | `/clients` | Listar clientes |
| POST | `/clients` | Criar cliente |
| GET | `/clients/:id` | Buscar cliente |
| PATCH | `/clients/:id` | Atualizar cliente |
| DELETE | `/clients/:id` | Remover cliente |
| GET | `/clients/:id/messages` | Mensagens do cliente |
| POST | `/webhooks/whatsapp` | Webhook UazAPI (autenticado por token) |
| POST | `/google/poll` | Buscar novos docs em todas as pastas `meet records` abaixo da pasta raiz da equipe |
| GET | `/google/docs/:docId/text` | Extrair texto de um Google Doc |

## Deploy

```bash
# Docker
docker compose up -d

# Produção (Coolify / Railway / etc.)
# 1. Configurar variáveis de ambiente
# 2. Post-deploy command: yarn migration:run
# 3. Porta: 3000
```
