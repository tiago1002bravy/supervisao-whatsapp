Consulte https://apiatend.bravy.com.br/alertas/sem-resposta?min=30 via curl e liste os grupos aguardando resposta da Bravy.

Remova da lista qualquer grupo cujo campo `cliente` seja "João Pedro Nascimento".

Após obter os dados, apresente a análise em três blocos de prioridade, ordenados do mais antigo para o mais recente dentro de cada bloco:

---

## Prioridade 1 — Responder agora

Inclua aqui grupos que se enquadrem em pelo menos um destes critérios:
- A última mensagem contém espera explícita (ex: "aguardo", "estamos aguardando", "podem retornar")
- O cliente demonstra insatisfação ou frustração
- O cliente fez uma pergunta direta e aguarda resposta há mais de 24h

Tabela com colunas: # | Cliente | Aguardando | Por quê é urgente

---

## Prioridade 2 — Responder em seguida

Inclua aqui grupos com:
- Dúvida técnica aberta
- Pedido específico (ex: gravação, documento, acesso)
- Horário marcado que já passou e não houve follow-up
- Aguardando há mais de 24h sem se enquadrar na prioridade 1

Tabela com colunas: # | Cliente | Aguardando | Por quê

---

## Prioridade 3 — Pode aguardar

Inclua aqui grupos cuja última mensagem é de cortesia ou confirmação sem pergunta aberta (ex: "Obrigada", "Ok", "feito", "❤️", "Sim! ✅", "Tmj").

Liste apenas os nomes em linha, sem tabela.

---

Ao final, exiba um resumo: "X para agora, Y em seguida, Z podem esperar."

Não exiba a tabela geral com todos os grupos — apenas os três blocos de prioridade acima.
