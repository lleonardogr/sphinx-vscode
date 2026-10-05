# Agenda telefônica (TreeMap)

Mantenha uma agenda que sempre lista os nomes em **ordem alfabética**. Leia comandos e responda cada um:

| Comando | Imprime |
|---------|---------|
| `add NAME NUMBER` | `Added NAME`, ou `Updated NAME` se o nome já estava lá (o número é trocado) |
| `find NAME` | `NAME: NUMBER`, ou `NAME not found` |
| `remove NAME` | `Removed NAME`, ou `NAME not found` |
| `list` | uma linha `NAME: NUMBER` por contato, ordenada pelo nome, ou `Phone book is empty` |

**Entrada**

- Linha 1: `n`, o número de comandos
- Depois, `n` comandos. Nomes e números não têm espaços.

**Saída**

Uma resposta por comando (várias linhas no `list`).

**O que você precisa saber**

- Um `TreeMap` é um mapa que mantém as **chaves ordenadas**. Strings são ordenadas pelo código dos caracteres, então maiúsculas vêm antes das minúsculas (`Zoe` antes de `adam`).
- `put(chave, valor)` devolve o valor anterior, ou `null` se a chave era nova. `remove(chave)` funciona do mesmo jeito.
- `get(chave)` devolve `null` para uma chave que não existe, e `containsKey(chave)` diz se ela existe.
