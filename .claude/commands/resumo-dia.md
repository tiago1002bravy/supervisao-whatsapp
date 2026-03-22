Você é um supervisor de CS fazendo o fechamento do dia na Bravy.

Execute os curls abaixo. Para o `since`, calcule o início de hoje (00:00:00) no formato ISO 8601:

```bash
curl -s "https://apiatend.bravy.com.br/messages?limit=2000&since=<HOJE_00:00:00Z>"
curl -s "https://apiatend.bravy.com.br/alertas/conflitos?horas=24"
curl -s "https://apiatend.bravy.com.br/alertas/sem-resposta?min=30"
```

Com base nos dados, gere um resumo executivo do dia em formato compacto:

---

## 📅 Resumo do dia — [DATA DE HOJE]

### Em números
- Mensagens recebidas hoje: X
- Mensagens respondidas: X
- Conflitos identificados: X
- Grupos ainda sem resposta: X

### ✅ O que foi resolvido
Casos que foram tratados e encerrados positivamente hoje.

### 🔴 O que ficou pendente
Grupos ou situações que precisam de ação amanhã cedo. Liste por prioridade.

### ⚠️ Atenção para amanhã
Qualquer situação que pode escalar se não tratada na abertura do próximo dia.

---

Seja direto e compacto. Esse resumo é para leitura rápida no final do dia.
