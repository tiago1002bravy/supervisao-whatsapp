# Configuração

> Edite as duas variáveis abaixo antes de começar a usar.

API_BASE_URL=https://SEU-PROJETO.up.railway.app
EMPRESA=Minha Empresa

---

# Contexto do projeto

Este projeto monitora os grupos de WhatsApp da **$EMPRESA** via Zappfy.

A API backend está em **$API_BASE_URL**.

Sempre que um comando pedir para consultar a API, use a URL acima com `curl`.

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
