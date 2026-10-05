# Gerador de IDs (static)

Um balcão de atendimento dá um número para cada ticket novo: o primeiro é `#1`, o próximo `#2`, e assim por diante. Complete a classe `Ticket` para que **cada ticket ganhe o próximo id automaticamente** quando for criado, e `Ticket.count()` diga quantos foram criados.

O `main` está pronto. Para três tickets ele imprime:

```
#1 Fix login
#2 Add dark mode
#3 Update docs
Tickets created: 3
```

**Entrada**

- Linha 1: `n`, o número de tickets (0 a 100)
- Depois, `n` linhas, cada uma com o título de um ticket

**O que você precisa saber**

- Um **campo `static`** pertence à classe: existe uma cópia só, compartilhada por todos os objetos, que é exatamente o que um contador precisa. Um campo normal dá uma cópia para cada objeto.
- `nextId++` usa o valor atual e depois soma 1, então `id = nextId++;` pega um número e avança o contador de uma vez.
- Um **método `static`** é chamado pela classe (`Ticket.count()`), sem objeto.
