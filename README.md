# Supervisão WhatsApp

Supervisione os grupos e conversas de WhatsApp da sua empresa direto pelo Claude Code — sem dashboard, sem app, só comandos.

## O que faz

- Recebe mensagens (grupos e privado) via webhook Zappfy
- Armazena tudo no PostgreSQL
- Expõe alertas de grupos sem resposta e conflitos
- Comandos de análise prontos para usar no Claude Code

---

## Instalação

### Pré-requisitos

- [Claude Code](https://claude.ai/code) instalado (`npm install -g @anthropic-ai/claude-code`)
- Conta no [Railway](https://railway.app)
- Conta no [Zappfy](https://dash.zappfy.io/signin) com uma instância criada e WhatsApp conectado

### Passo a passo

**1.** Faça um fork deste repositório e clone localmente:

```bash
git clone https://github.com/SEU-USUARIO/supervisao-whatsapp
cd supervisao-whatsapp
```

**2.** Abra o Claude Code na pasta:

```bash
claude
```

**3.** Execute o instalador:

```
/instalar
```

O Claude vai pedir as credenciais e cuidar de todo o resto — Railway, banco, deploy e configuração.

**4.** Único passo manual: configurar a URL do webhook no painel do Zappfy (o instalador vai te mostrar a URL exata).

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
