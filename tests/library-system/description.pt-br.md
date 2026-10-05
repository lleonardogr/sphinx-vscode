# Sistema da biblioteca

Construa o sistema de console de uma pequena biblioteca, com **classes** para os livros e para a própria biblioteca. Este teste junta **coleções**, **métodos** e **orientação a objetos** em um programa só.

**O que o seu programa faz**

Leia comandos, um por linha, até `exit`:

| Comando | Imprime |
|---------|---------|
| `add ID TITLE` | `Added book ID: TITLE`, ou `Book ID already exists`. O título pode ter espaços. |
| `join NAME` | `Member NAME joined`, ou `Member NAME already exists` |
| `borrow ID NAME` | `NAME borrowed TITLE` (veja as verificações abaixo) |
| `return ID` | `TITLE returned`, ou `No book ID`, ou `TITLE is not borrowed` |
| `list` | uma linha por livro, ordenada pelo ID: `ID TITLE - available` ou `ID TITLE - borrowed by NAME`; ou `No books` |
| `exit` | `Books: n, borrowed: m`, depois `Goodbye!`, e o programa termina |
| qualquer outra coisa | `Unknown command` |

No `borrow`, confira nesta ordem: `No book ID`, `No member NAME`, `TITLE is already borrowed by OUTRO` e `NAME has reached the limit of 2 books` (um membro pode ter no máximo 2 livros ao mesmo tempo).

IDs e nomes são uma palavra só; os IDs são ordenados alfabeticamente (`B10` vem antes de `B2`).

**Exemplo**

Entrada:

```
add B1 Dom Casmurro
add B2 The Hobbit
join ana
borrow B1 ana
borrow B1 bia
join bia
borrow B1 bia
list
return B1
borrow B1 bia
exit
```

Saída:

```
Added book B1: Dom Casmurro
Added book B2: The Hobbit
Member ana joined
ana borrowed Dom Casmurro
No member bia
Member bia joined
Dom Casmurro is already borrowed by ana
B1 Dom Casmurro - borrowed by ana
B2 The Hobbit - available
Dom Casmurro returned
bia borrowed Dom Casmurro
Books: 2, borrowed: 1
Goodbye!
```

**O que você precisa saber**

- Um objeto `Book` pode lembrar quem pegou emprestado em um campo; `null` quer dizer "disponível".
- Deixar as regras em métodos da `Library` (que devolvem a mensagem) mantém o `main` curto e cada regra em um lugar só.
- O `TreeMap` mantém os livros ordenados pelo ID, então o `list` só precisa percorrê-lo.
- `line.split(" ", 3)` divide em no máximo 3 partes, então o título mantém os espaços.
