Faça um diagnóstico completo do atendimento consultando as duas APIs abaixo via curl:

1. https://apiatend.bravy.com.br/alertas/sem-resposta?min=30
2. https://apiatend.bravy.com.br/alertas/conflitos?horas=24

Apresente o resultado em três seções:

## 🔴 Grupos sem resposta (há mais de 30 min)
Tabela com: Cliente | Última mensagem | Aguardando há

## 🟡 Conflitos / Risco de conflito (últimas 24h)
Tabela com: Cliente | Mensagem | Enviada em

## 📋 Resumo executivo
- Total de grupos aguardando resposta
- Total de alertas de conflito
- Casos mais urgentes (destaque em negrito)
- Recomendações de ação imediata

Ordene sempre do mais crítico para o menos crítico.
