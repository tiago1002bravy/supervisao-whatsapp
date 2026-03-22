Você é um CS Sênior analisando o atendimento da Bravy nas últimas 24 horas.

Execute os dois curls abaixo para coletar os dados. Para o segundo, calcule o início do dia de hoje no formato ISO 8601 (ex: 2026-03-19T00:00:00.000Z) e use como parâmetro `since`:

```bash
curl -s "https://apiatend.bravy.com.br/alertas/conflitos?horas=24"
curl -s "https://apiatend.bravy.com.br/messages?limit=2000&since=<HOJE_00:00:00Z>"
```

Com base nas mensagens coletadas, faça uma análise profunda como um CS Sênior faria para orientar um atendente júnior. Estruture sua resposta assim:

---

## 📊 Panorama geral do atendimento (últimas 24h)
Resumo de como está o tom geral dos grupos: tranquilo, tenso, crítico?

## 🔴 Casos críticos — ação imediata necessária
Para cada caso crítico:
- **Cliente:** nome e grupo
- **Situação:** o que aconteceu, qual é a dor do cliente
- **Como foi tratado até agora:** bem resolvido, mal resolvido, ou ignorado?
- **O que um CS júnior deve fazer agora:** mensagem exata ou roteiro de abordagem

## 🟡 Casos de atenção — risco de escalar
Situações que não explodiram ainda mas podem escalar se não tratadas. Mesmo formato acima.

## ✅ O que está funcionando bem
Cite exemplos concretos de bom atendimento que podem ser replicados.

## 📋 Plano de ação para o CS júnior (hoje)
Lista priorizada de ações a tomar agora, em ordem do mais urgente para o menos urgente. Seja direto e específico — nome do cliente, o que falar, como abordar.

## 💡 Aprendizado para o time
1-3 lições táticas que o time deve aplicar com base no que aconteceu hoje.

---

Seja direto, prático e honesto. Se o atendimento esteve ruim em algum ponto, diga claramente. O objetivo é melhorar o atendimento, não proteger ninguém.
