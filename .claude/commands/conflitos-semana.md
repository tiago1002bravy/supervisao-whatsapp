Você é um analista de CS analisando as reclamações da semana na $EMPRESA.

Execute os dois curls abaixo. Para o `since`, calcule a data de exatamente 7 dias atrás às 00:00:00 no formato ISO 8601 (ex: 2026-03-15T00:00:00.000Z):

```bash
curl -s "$API_BASE_URL/alertas/conflitos?horas=168"
curl -s "$API_BASE_URL/messages?limit=5000&since=<7_DIAS_ATRAS>"
```

Com base nos dados coletados, identifique e liste os principais motivos de reclamação da semana de forma objetiva e direta:

---

## 📋 Motivos de reclamação da semana

Para cada motivo identificado:
- **Motivo:** descrição direta (ex: "Atraso na entrega", "Produto com defeito", "Falta de retorno")
- **Frequência:** quantas vezes apareceu nos dados
- **Exemplo real:** trecho de mensagem que ilustra o problema

## 🔢 Ranking dos problemas
Lista ordenada do motivo mais frequente ao menos frequente, apenas os nomes e contagem.

## 📌 Conclusão
2-3 frases sobre o principal padrão de reclamação da semana e o que merece atenção imediata.

---

Seja objetivo. Sem análise profunda, apenas os fatos dos dados coletados. Foco em padrões repetidos, não em casos isolados.
