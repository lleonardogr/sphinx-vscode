# Rolador de dados

Jogos, simulações e testes precisam de números aleatórios, mas o computador segue instruções: ele só consegue **calcular** números que parecem aleatórios. O próprio `rand()` do C muitas vezes é um **gerador congruencial linear**, poucas linhas que você mesmo pode escrever. Com a mesma **semente**, ele dá a mesma sequência toda vez, que é exatamente o que se quer para um replay ou um teste.

O gerador guarda um `state` de 32 bits. Cada chamada faz:

```
state = state × 1103515245 + 12345     (mantido em 32 bits)
value = bits 16 a 30 de state           ((state >> 16) & 0x7FFF, de 0 a 32767)
```

Uma jogada do dado é `value % 6 + 1`.

Leia uma semente e um número de jogadas, imprima as jogadas e depois quantas vezes cada face saiu. Com semente 1 e 10 jogadas:

```
3 5 4 2 2 6 1 4 1 1
1: 3
2: 2
3: 1
4: 2
5: 1
6: 1
```

**Entrada**

Uma linha: a semente (0 a 4294967295) e `n`, o número de jogadas (0 ≤ n ≤ 1000).

**Saída**

As jogadas numa linha, separadas por espaços (uma linha vazia quando `n` é 0), e depois uma linha por face: `1: ` e a contagem, até `6: `.

**Coisas para saber**

- Escreva o gerador como funções: `next_random()` e `roll_die()`, com o estado numa variável `static`, para ele sobreviver entre chamadas e nenhum outro código mexer nele.
- `uint32_t`, de `<stdint.h>`, tem exatamente 32 bits, e a aritmética sem sinal dá a volta, então `state * 1103515245u` fica em 32 bits sozinho.
- `>>` desloca os bits para a direita e `& 0x7FFF` mantém os 15 mais baixos.
