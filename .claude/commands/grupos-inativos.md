Você é um analista de CS identificando clientes que a $EMPRESA parou de atender ativamente.

Execute os curls abaixo. Para o `since`, calcule a data de exatamente 7 dias atrás às 00:00:00 no formato ISO 8601:

```bash
curl -s "$API_BASE_URL/messages?limit=5000&since=<7_DIAS_ATRAS>"
```

Analise os grupos presentes nos dados. Identifique grupos onde a $EMPRESA não enviou nenhuma mensagem nos últimos 7 dias, mas o cliente enviou mensagens:

---

## 👻 Grupos inativos — clientes sem retorno da $EMPRESA

Para cada grupo identificado:
- **Grupo/Cliente:** nome
- **Última mensagem do cliente:** data e conteúdo resumido
- **Dias sem resposta da $EMPRESA:** número
- **Urgência:** 🔴 Alta (cliente perguntou algo) / 🟡 Média (só comentou) / ⚪ Baixa (mensagem informativa)

## 📊 Resumo
- Total de grupos inativos: X
- Média de dias sem resposta: X
- Grupos com urgência alta: X

## 📌 Ação recomendada
Quais grupos contatar primeiro e por quê.

---

Foque em grupos onde o cliente claramente espera uma resposta. Ignore grupos onde o último contato foi da $EMPRESA.
