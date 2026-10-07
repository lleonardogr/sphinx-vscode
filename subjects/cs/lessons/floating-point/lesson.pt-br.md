## Por que isso importa

Experimente isto no Java:

```java
IO.println(0.1 + 0.2);   // 0.30000000000000004
```

Não é um bug do Java: toda linguagem que usa o `double` padrão imprime a mesma coisa. Para entender por quê, precisamos ver como os computadores guardam números com parte fracionária.

## Frações em binário

No decimal, as posições depois da vírgula valem décimos, centésimos, milésimos. No binário elas valem **metades**:

| Posição | 1ª | 2ª | 3ª | 4ª | 5ª |
|---------|----|----|----|----|----|
| Vale | ½ = 0,5 | ¼ = 0,25 | ⅛ = 0,125 | 1/16 = 0,0625 | 1/32 = 0,03125 |

Então o binário `0.101` é ½ + ⅛ = **0,625**, e `0.11` é ½ + ¼ = **0,75**.

Para escrever uma fração decimal em binário, **dobre-a** de novo e de novo. A cada vez, a parte inteira (0 ou 1) é o próximo bit. Para 0,625: 1,25 dá **1**, fica 0,25; 0,5 dá **0**; 1,0 dá **1**, e não sobra nada. Então 0,625 = `0.101`.

## Frações que nunca terminam

No decimal, 1/3 nunca termina: 0,3333… O mesmo acontece no binário, mas com números que parecem inofensivos. Dobrando 0,1:

0,2 → **0**, 0,4 → **0**, 0,8 → **0**, 1,6 → **1**, 1,2 → **1**, 0,4 → **0**, 0,8 → **0**, 1,6 → **1**, …

O padrão `0011` se repete para sempre: 0,1 = `0.0001100110011…`. O computador precisa parar em algum lugar, então o 0,1 que ele guarda está levemente errado, assim como 0,2 e 0,3. Somar dois números levemente errados dá um resultado que não é o `double` mais próximo de 0,3. Só frações cujo denominador é uma potência de 2 (½, ¼, ⅜, …) são exatas.

## Ponto flutuante

Um `double` funciona como a notação científica, mas em binário. Ele usa 64 bits divididos em três partes:

| Parte | Bits | Significado |
|-------|------|-------------|
| Sinal | 1 | positivo ou negativo |
| Expoente | 11 | onde fica a vírgula (uma potência de 2) |
| Mantissa | 52 | os bits significativos |

Por exemplo, 6,5 é `110.1` em binário, ou 1,101 × 2²: a mantissa guarda `101` e o expoente guarda 2. Como a vírgula "flutua", os mesmos 64 bits guardam 0,000000001 e 9.000.000.000.000 com a mesma precisão relativa: cerca de **15 a 16 dígitos decimais significativos**. Um `float` tem 32 bits e só cerca de 7 dígitos.

## O que isso significa para o seu código

- **Não compare doubles com `==`** depois de fazer contas. Verifique se estão perto o bastante: `Math.abs(a - b) < 1e-9`.
- **Não guarde dinheiro num `double`.** Conte centavos num `long` (R$ 19,90 são 1990 centavos), ou use `BigDecimal`, que guarda dígitos decimais exatamente.
- Imprimir normalmente esconde o erro: `IO.println(0.1)` mostra `0.1`, porque o Java imprime o decimal mais curto que volta para o mesmo `double`.

## Resumo

- Depois da vírgula binária, as posições valem ½, ¼, ⅛, …; dobre uma fração para achar os bits dela.
- Muitas frações decimais, como 0,1, se repetem para sempre em binário, então são guardadas de forma aproximada.
- Um `double` guarda um sinal, um expoente e uma mantissa de 52 bits: cerca de 15–16 dígitos significativos.
- Compare doubles com uma tolerância e guarde dinheiro em centavos inteiros.
