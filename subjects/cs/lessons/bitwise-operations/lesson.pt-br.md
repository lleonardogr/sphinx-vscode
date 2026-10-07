## Por que isso importa

As portas da lição anterior também funcionam com **números inteiros de uma vez**: o Java aplica AND, OR ou XOR aos 32 bits de dois `int`s num único passo. Essas **operações bit a bit** são como programas guardam muitas flags de sim/não num só número, leem cores e permissões de arquivos, e fazem algumas contas muito rápido.

## Os operadores

| Operador | Nome | O que faz com cada par de bits |
|----------|------|--------------------------------|
| `a & b` | AND | 1 só onde os dois são 1 |
| `a \| b` | OR | 1 onde pelo menos um é 1 |
| `a ^ b` | XOR | 1 onde eles são diferentes |
| `~a` | NOT | inverte todos os bits |
| `a << n` | deslocamento à esquerda | move os bits n posições para a esquerda |
| `a >> n` | deslocamento à direita | move os bits n posições para a direita |

Pegue 12 (`1100`) e 10 (`1010`):

| | Bits | Valor |
|---|------|-------|
| `12 & 10` | `1000` | 8 |
| `12 \| 10` | `1110` | 14 |
| `12 ^ 10` | `0110` | 6 |

Repare na diferença para `&&` e `||`: esses trabalham com booleanos, enquanto `&`, `|` e `^` trabalham bit a bit com números.

## Deslocando

Deslocar 1 posição para a esquerda acrescenta um 0 à direita, o que **dobra** o número, assim como acrescentar um 0 no decimal multiplica por 10: `5 << 1` é 10 e `1 << 4` é 16. Deslocar 1 posição para a direita **divide ao meio**, descartando o último bit: `13 >> 1` é 6.

Para números negativos, `>>` copia o bit de sinal, então `-16 >> 2` é −4. O `>>>` coloca zeros no lugar.

## Máscaras: trabalhando com bits individuais

Uma **máscara** é um número só com os bits que interessam ligados. `1 << k` é uma máscara para o bit k (os bits são numerados a partir do 0, na direita):

| Tarefa | Código |
|--------|--------|
| O bit k está ligado? | `(n >> k) & 1` ou `(n & (1 << k)) != 0` |
| Ligar o bit k | `n \| (1 << k)` |
| Desligar o bit k | `n & ~(1 << k)` |
| Inverter o bit k | `n ^ (1 << k)` |
| Manter só os 8 últimos bits | `n & 0xFF` |

Uma bem útil: `n & 1` é 1 para números ímpares e 0 para pares.

## Flags na vida real

As permissões de arquivos no Linux e no macOS são flags de bits: leitura = 4 (`100`), escrita = 2 (`010`), execução = 1 (`001`). A permissão 6 é `110`, leitura e escrita. Para dar permissão de execução você faz um OR: `6 | 1 = 7`.

As cores funcionam do mesmo jeito. `0xFF8800` guarda vermelho, verde e azul num só `int`, e dá para separá-los com deslocamentos e máscaras:

```java
int color = 0xFF8800;
int red   = (color >> 16) & 0xFF;  // 255
int green = (color >> 8) & 0xFF;   // 136
int blue  = color & 0xFF;          // 0
```

## Resumo

- `&`, `|`, `^` e `~` aplicam AND, OR, XOR e NOT a cada bit de um número.
- `<<` dobra a cada posição deslocada, `>>` divide ao meio.
- Uma máscara como `1 << k` seleciona bits: `&` testa ou desliga, `|` liga, `^` inverte.
- Permissões e cores guardam vários valores nos bits de um só número.
