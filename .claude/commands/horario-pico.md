Você é um analista de CS mapeando os horários de maior demanda da Bravy.

Execute o curl abaixo. Para o `since`, calcule a data de exatamente 7 dias atrás às 00:00:00 no formato ISO 8601:

```bash
curl -s "https://apiatend.bravy.com.br/messages?limit=5000&since=<7_DIAS_ATRAS>"
```

Analise os horários das mensagens recebidas dos clientes (não da Bravy). Agrupe por faixa horária:

---

## ⏰ Horários de pico de atendimento (últimos 7 dias)

### Volume por faixa horária
| Horário | Volume de mensagens | Intensidade |
|---|---|---|
| 06h–09h | X | 🟢/🟡/🔴 |
| 09h–12h | X | ... |
| 12h–15h | X | ... |
| 15h–18h | X | ... |
| 18h–21h | X | ... |
| 21h–00h | X | ... |
| 00h–06h | X | ... |

### Dias da semana com mais mensagens
Ranking dos dias com maior volume.

## 🎯 Horários críticos
Faixas com alta demanda de clientes mas menor cobertura de respostas da Bravy.

## 📌 Recomendação
Como escalar o time com base nesses dados (horários que precisam de reforço).

---

Base o ranking em dados reais das mensagens analisadas.
