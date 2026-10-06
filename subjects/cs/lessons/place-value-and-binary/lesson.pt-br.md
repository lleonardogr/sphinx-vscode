## Por que isso importa

O computador guarda tudo (números, textos, imagens, seus programas em Java) como longas sequências de **0s e 1s**. Cada 0 ou 1 é um **bit**, abreviação de *binary digit*, dígito binário. Dentro dos chips, um bit é uma chave minúscula que está desligada (0) ou ligada (1).

Para entender por que um `int` tem limite, por que as cores aparecem como `#FF8800` ou por que `0.1 + 0.2` não dá exatamente `0.3`, primeiro é preciso ler e escrever números em **binário**. A boa notícia: o binário funciona exatamente como os números decimais que você já conhece. Só a base muda.

## Valor posicional: como o decimal funciona

No número **4705**, cada dígito vale mais ou menos dependendo da **posição**:

| Milhares | Centenas | Dezenas | Unidades |
|:---:|:---:|:---:|:---:|
| 4 | 7 | 0 | 5 |
| 4 × 1000 | 7 × 100 | 0 × 10 | 5 × 1 |

4000 + 700 + 0 + 5 = **4705**. Cada posição vale 10 vezes a posição da direita: 1, 10, 100, 1000. São as potências de 10, porque o decimal tem **base 10**: dez dígitos, de 0 a 9.

## Binário: base 2

O binário tem só dois dígitos, 0 e 1, então cada posição vale **2 vezes** a posição da direita: 1, 2, 4, 8, 16, 32, 64, 128… São as potências de 2.

![O byte 10110010 com os valores de cada posição](place-values.svg)

Para ler um número binário, **some os valores das posições que têm 1**. Na figura, `10110010` é 128 + 32 + 16 + 2 = **178**.

Um exemplo menor: **1011** em binário tem 1 nas posições que valem 8, 2 e 1, então vale 8 + 2 + 1 = **11**. Para não confundir, escrevemos a base como um número pequeno depois dele, 1011₂, ou com o prefixo `0b`, como o Java faz: `0b1011`.

## Contando em binário

| Decimal | Binário | | Decimal | Binário |
|:---:|:---:|:---:|:---:|:---:|
| 0 | 0 | | 5 | 101 |
| 1 | 1 | | 6 | 110 |
| 2 | 10 | | 7 | 111 |
| 3 | 11 | | 8 | 1000 |
| 4 | 100 | | 9 | 1001 |

Quando uma posição "fica sem" dígitos, ela volta a 0 e leva 1 para a esquerda, igual a 9 + 1 = 10 no decimal. No binário isso acontece a cada 1: 1 + 1 = 10₂.

## Do decimal para o binário

**Divida por 2 repetidamente** e anote os restos. Depois leia os restos **do último para o primeiro**. Para 13:

| Divisão | Quociente | Resto |
|:---:|:---:|:---:|
| 13 ÷ 2 | 6 | **1** |
| 6 ÷ 2 | 3 | **0** |
| 3 ÷ 2 | 1 | **1** |
| 1 ÷ 2 | 0 | **1** |

Lendo de baixo para cima: 13 = **1101₂**. Conferindo: 8 + 4 + 1 = 13. ✓

Outro jeito: encontre a maior potência de 2 que cabe (8 cabe em 13), subtraia (13 − 8 = 5) e repita com o que sobrou (4 cabe em 5, sobra 1, e depois 1 cabe). As potências usadas recebem 1: 8, 4 e 1 dão 1101₂.

## Quantos valores cabem em n bits?

Cada bit a mais **dobra** o número de combinações. Com **n bits** existem **2ⁿ** valores diferentes, de 0 até 2ⁿ − 1:

- 1 bit: 2 valores (0 e 1)
- 4 bits: 16 valores (0 a 15)
- 8 bits, um **byte**: 256 valores (0 a 255)

É por isso que tantos limites na computação são potências de 2.

## Erros comuns

- **Ler os restos de cima para baixo.** O primeiro resto é o bit *mais à direita*.
- **Pular os zeros do meio.** 1001₂ vale 9, não 3: toda posição conta, mesmo com 0.
- **Misturar bases.** "10" pode ser dez (decimal) ou dois (binário). Escreva 10₂ ou `0b10` quando for binário.

## No Java

Você pode escrever números binários direto no código com o prefixo `0b`:

```java
int flags = 0b1011;
IO.println(flags); // 11
```

O Java também converte para você, com `Integer.toBinaryString(11)`, que dá `"1011"`. Nos desafios desta unidade você vai escrever essas conversões, para entender de verdade como elas funcionam.

## Termos importantes

- **Bit**: um dígito binário, 0 ou 1.
- **Base**: quantos dígitos um sistema de numeração tem (decimal: 10, binário: 2).
- **Valor posicional**: quanto uma posição vale (uma potência da base).
- **Bit mais significativo (MSB)**: o bit mais à esquerda, que vale mais.
- **Bit menos significativo (LSB)**: o bit mais à direita, que vale 1.
