# Vencedor do jogo da velha

Leia um tabuleiro de jogo da velha e diga como está o jogo. O `X` sempre joga primeiro, e depois os jogadores se revezam. Casas vazias são `.`.

| Tabuleiro | Imprima |
|-----------|---------|
| impossível em um jogo de verdade (veja abaixo) | `Invalid board` |
| o `X` tem três em linha | `X wins` |
| o `O` tem três em linha | `O wins` |
| cheio e sem vencedor | `Draw` |
| nos outros casos | `Game in progress` |

Um tabuleiro é **inválido** quando:

- o número de `X` não é igual ao número de `O` nem um a mais, ou
- os dois jogadores têm três em linha, ou
- o `X` ganhou mas não tem uma marca a mais que o `O` (o jogo devia ter parado), ou o `O` ganhou mas as quantidades não são iguais.

**Entrada**

Três linhas de três caracteres: `X`, `O` ou `.`.

**Saída**

Uma das cinco mensagens.

**O que você precisa saber**

- Guarde o tabuleiro em um `char[][]`. `line.toCharArray()` transforma uma linha em um `char[]`.
- Um **método auxiliar** `wins(board, player)` que confere as 3 linhas, 3 colunas e 2 diagonais evita escrever as mesmas verificações para X e O.
- Confira os casos inválidos **antes** de anunciar um vencedor.
