# Somador com propagação de vai-um

O processador soma números com **somadores completos**, um por bit. Cada um recebe dois bits **a** e **b** e o **vai-um** da coluna à sua direita, e produz:

- **soma** = a XOR b XOR vaiUm
- **vai-um de saída** = (a AND b) OR (vaiUm AND (a XOR b))

O vai-um de saída entra na próxima coluna à esquerda, então ele se "propaga" da direita para a esquerda, como na soma feita à mão.

```
         a   00000101   (5)
       + b   00000011   (3)
    = soma   00001000   (8)
    vai-um   00000111   (o que cada coluna passa para a esquerda)
```

Leia dois números de 8 bits e some-os só com portas.

**Entrada**

Duas linhas, cada uma com exatamente 8 caracteres `0` ou `1`.

**Saída**

Três linhas: `Sum: ` e a soma de 8 bits, `Carries: ` e o vai-um de saída de cada coluna (da coluna mais à esquerda até a mais à direita), e `Carry out: ` e o vai-um final, que é 1 quando a soma não cabe em 8 bits.

**O que você precisa saber**

- `bits.charAt(i) - '0'` transforma um caractere em 0 ou 1, para você usar `^`, `&` e `|` nele.
- Comece pela coluna mais à direita (índice 7) com vai-um 0, e vá para a esquerda.
- Use as portas: converter os bits para número e somar com `+` não vale aqui.
