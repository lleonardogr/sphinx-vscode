## Por que isso importa

Bits são só 0s e 1s: não existe sinal de menos. Mesmo assim, o `int` do Java guarda −5 tão facilmente quanto 5. O truque que os computadores usam, o **complemento de dois**, também explica por que `Integer.MAX_VALUE + 1` de repente vira um número negativo enorme.

## Uma primeira ideia: um bit de sinal

A ideia mais simples é usar o bit mais à esquerda como sinal: 0 para positivo, 1 para negativo. Em 8 bits, 5 seria `00000101` e −5 seria `10000101`.

Ela tem dois problemas. Existem dois zeros (`00000000` e `10000000`, o "menos zero"), e a soma comum dá respostas erradas: `00000101` + `10000101` é `10001010`, que significaria −10, não 0. O hardware precisaria de circuitos separados para números com sinal.

## Complemento de dois

Os computadores usam uma regra mais esperta. Num byte, o bit mais à esquerda vale **−128** em vez de +128, e todos os outros bits mantêm seu valor de sempre:

| Bit | 1º | 2º | 3º | 4º | 5º | 6º | 7º | 8º |
|-----|----|----|----|----|----|----|----|----|
| Vale | −128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |

Então `11111011` é −128 + 64 + 32 + 16 + 8 + 2 + 1 = **−5**, e `10000000` é **−128**. Um byte agora guarda os números de **−128 a 127**: só existe um zero, e o bit mais à esquerda continua dizendo o sinal.

## Deixando um número negativo

Para achar os bits de −5:

1. Escreva 5 em binário: `00000101`.
2. **Inverta** todos os bits: `11111010`.
3. **Some 1**: `11111011`.

Outro jeito de ver: um número negativo `n` é guardado como `n + 256`. −5 é guardado como 251, e 251 em binário é `11111011`.

A melhor parte é que a soma simplesmente funciona. 5 + (−5) é `00000101` + `11111011` = `1 00000000`: o nono bit não cabe no byte e é descartado, sobrando 0. O mesmo circuito de soma serve para números positivos e negativos.

## Os tamanhos dos tipos do Java

| Tipo | Bits | Menor | Maior |
|------|------|-------|-------|
| `byte` | 8 | −128 | 127 |
| `short` | 16 | −32.768 | 32.767 |
| `int` | 32 | −2.147.483.648 | 2.147.483.647 |
| `long` | 64 | cerca de −9,2 × 10¹⁸ | cerca de 9,2 × 10¹⁸ |

Com n bits, a faixa vai de −2ⁿ⁻¹ a 2ⁿ⁻¹ − 1: um número negativo a mais que positivo, porque o zero ocupa um dos padrões "positivos".

## Overflow

Quando um resultado precisa de mais bits do que o tipo tem, os bits extras são descartados e o número **dá a volta**:

```java
int big = Integer.MAX_VALUE;     // 01111111 11111111 11111111 11111111
IO.println(big + 1);             // -2147483648: 10000000 00000000 ...
IO.println((byte) 200);          // -56: 200 não cabe num byte
```

O Java não dá erro. Se os números podem ficar grandes, use `long`, ou verifique o resultado: calcular com `long` e comparar com `Integer.MAX_VALUE` diz se um resultado `int` é verdadeiro.

## Resumo

- O complemento de dois deixa o bit mais à esquerda negativo: num byte ele vale −128.
- Para inverter o sinal de um número, inverta todos os bits e some 1.
- Um byte guarda de −128 a 127; n bits guardam de −2ⁿ⁻¹ a 2ⁿ⁻¹ − 1.
- Resultados que não cabem dão a volta em silêncio: isso é overflow.
