Você é um analista de CS medindo o tempo de resposta da Bravy nos grupos de WhatsApp.

Execute os curls abaixo. Para o `since`, calcule a data de exatamente 7 dias atrás às 00:00:00 no formato ISO 8601:

```bash
curl -s "https://apiatend.bravy.com.br/messages?limit=5000&since=<7_DIAS_ATRAS>"
curl -s "https://apiatend.bravy.com.br/alertas/sem-resposta?min=0"
```

Analise o tempo entre mensagens de clientes e respostas da Bravy. Com base nos dados:

---

## ⏱️ Análise de tempo de resposta

### Grupos mais lentos
Top 5 grupos com maior tempo médio de resposta:
- **Grupo:** nome
- **Tempo médio de resposta:** em horas
- **Última mensagem sem resposta há:** X horas

### Horários de pior cobertura
Em quais horários do dia chegam mensagens que ficam mais tempo sem resposta?

### Tempo médio geral
Tempo médio de resposta da Bravy nos últimos 7 dias.

## 🔴 Alertas
Grupos com mais de 24h sem resposta atualmente.

## 📌 Conclusão
O que os dados indicam sobre cobertura e agilidade no atendimento.

---

Seja objetivo e direto com os números.
