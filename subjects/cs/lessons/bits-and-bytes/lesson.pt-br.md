## Por que isso importa

Todo número, letra, foto e programa num computador é guardado como **bits**. Saber quanto um grupo de bits consegue guardar explica enigmas do dia a dia: por que um `int` do Java para em 2.147.483.647, por que as cores têm 256 tons de vermelho e por que um contador pode de repente pular para um número negativo.

## O bit

Um **bit** (de *binary digit*, dígito binário) é o menor pedaço de informação: ele é **0** ou **1**. No hardware, é um interruptor minúsculo, desligado ou ligado, ou um ponto de um disco magnetizado para um lado ou para o outro.

Um bit só responde a uma pergunta de sim ou não. Para guardar mais, colocamos bits lado a lado.

## Cada bit dobra as possibilidades

Com 1 bit há 2 padrões: `0` e `1`. Acrescente um segundo bit e cada um desses padrões pode ser seguido de um 0 ou de um 1, então há 4: `00`, `01`, `10`, `11`. Um terceiro bit dobra de novo, para 8.

![Cada bit a mais dobra os padrões: 2, 4, 8](bit-patterns.svg)

Então **n bits têm 2ⁿ padrões**: 2 × 2 × … × 2, n vezes. Se usamos os padrões para os números 0, 1, 2, …, o **maior número é 2ⁿ − 1**, porque começamos a contar do 0.

| Bits | Padrões (2ⁿ) | Números |
|------|--------------|---------|
| 1 | 2 | 0 a 1 |
| 4 | 16 | 0 a 15 |
| 8 | 256 | 0 a 255 |
| 16 | 65.536 | 0 a 65.535 |
| 32 | 4.294.967.296 | 0 a 4.294.967.295 |

Dobrar cresce muito rápido. 10 bits já dão 1.024 padrões, cerca de mil, e cada 10 bits a mais multiplicam isso por cerca de mil de novo: 20 bits dão cerca de um milhão, 30 bits cerca de um bilhão.

## O byte

Os bits são agrupados de oito em oito, e um grupo de **8 bits é um byte**. Um byte guarda 2⁸ = **256** valores diferentes, de 0 a 255. Meio byte, 4 bits, se chama **nibble**, e é exatamente um dígito hexadecimal: é por isso que um byte sempre é escrito com dois dígitos hex, como `FF`.

A memória é organizada em bytes: cada byte tem seu próprio endereço, e o tamanho dos arquivos é contado em bytes. Uma letra de texto simples como `A` ocupa um byte, e um pixel de uma foto normalmente ocupa três: um byte para o vermelho, um para o verde e um para o azul. É daí que vêm os 256 tons de cada cor.

## Quantos bits um número precisa?

Inverta a pergunta: para guardar o número 300, quantos bits são necessários? 8 bits só chegam a 255, e 9 bits chegam a 511, então **300 precisa de 9 bits**.

Um jeito simples de contar é **dividir o número ao meio até ele chegar a 0**: cada divisão remove um dígito binário. 300 → 150 → 75 → 37 → 18 → 9 → 4 → 2 → 1 → 0 são 9 divisões, então 9 bits. É o mesmo que escrever 300 em binário, `100101100`, e contar os dígitos.

## Bits no Java

O Java dá a cada tipo de número inteiro um tamanho fixo, igual em qualquer computador:

| Tipo | Bits | Faixa |
|------|------|-------|
| `byte` | 8 | −128 a 127 |
| `short` | 16 | −32.768 a 32.767 |
| `int` | 32 | cerca de −2,1 bilhões a 2,1 bilhões |
| `long` | 64 | cerca de −9,2 × 10¹⁸ a 9,2 × 10¹⁸ |

As faixas são divididas entre números negativos e positivos, então um `int` vai até 2³¹ − 1 = 2.147.483.647 em vez de 2³² − 1. Como os números negativos são guardados é o tema de uma unidade mais adiante.

Quando uma conta passa do maior valor, os bits simplesmente **dão a volta**. Isso se chama **overflow** (estouro), e o Java não avisa:

```java
int big = 2_147_483_647;
IO.println(big + 1); // imprime -2147483648
```

É por isso que os desafios desta unidade usam `long` sempre que os números podem ficar grandes.

## Resumo

- Um bit é 0 ou 1; um byte são 8 bits.
- n bits têm 2ⁿ padrões, então contam de 0 a 2ⁿ − 1. Cada bit a mais dobra isso.
- Os bits que um número precisa são as vezes que dá para dividi-lo ao meio até chegar a 0.
- `byte`, `short`, `int` e `long` do Java têm 8, 16, 32 e 64 bits; passar do limite faz o valor dar a volta.
