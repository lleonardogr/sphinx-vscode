# Mapa de assentos

Um pequeno teatro tem `rows` fileiras com `seats` assentos cada. Leia os pedidos de reserva e depois imprima o mapa de assentos.

| Pedido | Imprime |
|--------|---------|
| `book r s` para um assento livre | `Booked row r seat s` |
| `book r s` para um assento ocupado | `Seat taken` |
| `book r s` fora do teatro | `Invalid seat` |

Fileiras e assentos são numerados **a partir de 1**. Depois de todos os pedidos, imprima o mapa, uma linha por fileira, com `X` para assento ocupado e `.` para livre:

```
X...
..X.
....
```

**Entrada**

- Linha 1: `rows seats` (de 1 a 20 cada)
- Linha 2: `n`, o número de pedidos
- Depois, `n` linhas `book r s`

**Saída**

Uma linha por pedido e depois o mapa.

**O que você precisa saber**

- Um `boolean[][]` começa com todas as casas `false` (livre).
- Converta números de assento em índices com `r - 1` e `s - 1`.
- Confira o intervalo **antes** de ler o array, senão um assento fora do intervalo lança uma exceção.
