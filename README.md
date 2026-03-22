# Supervisão WhatsApp

Supervisione os grupos de WhatsApp da sua empresa direto pelo Claude Code — sem dashboard, sem app, só comandos.

## O que faz

- Recebe mensagens dos grupos via webhook Zappfy
- Armazena tudo no PostgreSQL
- Expõe alertas de grupos sem resposta e conflitos
- Comandos de análise prontos para usar no Claude Code

---

## Passo a passo de instalação

### 1. Fork do repositório

Faça um fork deste repositório no GitHub para a sua conta.

### 2. Deploy no Railway

1. Acesse [railway.app](https://railway.app) e crie um novo projeto
2. Adicione um serviço **PostgreSQL** (botão "Add Service")
3. Adicione um serviço **GitHub Repo** e selecione o fork
4. Na aba **Variables** do serviço, adicione as variáveis do arquivo `.env.example`

5. O deploy roda automaticamente — anote a URL pública gerada (ex: `https://meu-projeto.up.railway.app`)

### 3. Criar conta no Zappfy

Acesse [zappfy.com.br](https://zappfy.com.br) e crie sua conta.

### 4. Criar instância no Zappfy

1. No painel do Zappfy, crie uma nova instância
2. Copie o **token** da instância — você usou ele no passo 2
3. Conecte o WhatsApp escaneando o QR code

### 5. Configurar webhook no Zappfy

Na instância criada, configure o webhook:

```
URL: https://SEU-PROJETO.up.railway.app/webhooks/whatsapp
```

### 6. Instalar Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

### 7. Clonar o repositório

```bash
git clone https://github.com/SEU-USUARIO/supervisao-whatsapp
cd supervisao-whatsapp
```

### 8. Configurar o CLAUDE.md

Abra o arquivo `CLAUDE.md` e edite as duas linhas:

```
API_BASE_URL=https://SEU-PROJETO.up.railway.app
EMPRESA=Nome da Sua Empresa
```

### 9. Abrir o Claude Code

```bash
claude
```

### 10. Usar os comandos

```
/sem-resposta
/dashboard
/conflitos
/resumo-dia
```

---

## Comandos disponíveis

| Comando | O que faz |
|---|---|
| `/sem-resposta` | Grupos aguardando resposta há mais de 30 min |
| `/conflitos` | Alertas de conflito das últimas 24h |
| `/dashboard` | Diagnóstico completo do atendimento |
| `/resumo-dia` | Fechamento do dia |
| `/atendentes-semana` | Desempenho dos atendentes na semana |
| `/tempo-resposta` | Tempo médio de resposta nos grupos |
| `/conflitos-ia` | Análise de conflitos com IA |
| `/conflitos-semana` | Reclamações da semana |
| `/elogios-semana` | Elogios e feedbacks positivos |
| `/grupos-inativos` | Clientes sem retorno nos últimos 7 dias |
| `/clientes-risco` | Clientes em risco de churn |
| `/semana-em-numeros` | Relatório semanal executivo |
| `/horario-pico` | Horários de maior demanda |
| `/revisar-atendimento` | Revisão de um grupo específico |

---

## Stack

- NestJS 11 + TypeScript
- PostgreSQL + TypeORM
- Zappfy (WhatsApp gateway)
- Claude Code (análise e comandos)
