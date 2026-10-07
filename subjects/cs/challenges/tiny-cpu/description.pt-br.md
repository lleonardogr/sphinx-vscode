# CPU minúscula

Um processador repete um ciclo bilhões de vezes por segundo: **buscar** a próxima instrução, **decodificar** o que ela pede, **executar**. Escreva um simulador de um processador minúsculo com um registrador, o **acumulador** (ACC), e 16 células de memória, de `memória[0]` a `memória[15]`. Tudo começa em 0.

| Instrução | O que faz |
|-----------|-----------|
| `SET n` | ACC = n |
| `LOAD a` | ACC = memória[a] |
| `STORE a` | memória[a] = ACC |
| `ADD a` | ACC = ACC + memória[a] |
| `SUB a` | ACC = ACC − memória[a] |
| `JUMP k` | continua na linha k |
| `JZ k` | se ACC for 0, continua na linha k |
| `OUT` | imprime ACC |
| `HALT` | para |

O contador de programa começa na linha **1**. Depois de cada instrução ele passa para a próxima linha, a menos que um `JUMP` ou um `JZ` (quando ACC é 0) o mande para outro lugar.

Este programa faz uma contagem regressiva a partir de 3: as linhas 1–4 põem 3 na memória[0] e 1 na memória[1]; as linhas 5–10 imprimem, subtraem 1 e repetem até o valor chegar a 0.

```
SET 3
STORE 0
SET 1
STORE 1
LOAD 0
OUT
SUB 1
STORE 0
JZ 11
JUMP 5
HALT
```

**Entrada**

O número de linhas `n` (1 ≤ n ≤ 50), depois as `n` linhas do programa. Os números `a` vão de 0 a 15, e `k` de 1 a n.

**Saída**

O que o programa imprime com `OUT`, um número por linha. Depois, uma linha final:

- `Halted after N steps` quando ele executa `HALT` ou passa da última linha (N conta todas as instruções executadas, inclusive o `HALT`);
- `Step limit reached` se ele ainda estiver rodando depois de 1000 passos;
- `Error at line K: <linha>` numa instrução que não está na tabela (ela não é contada).

**O que você precisa saber**

- Guarde o programa num array e use o contador de programa `pc` como índice: a linha `pc` é `program[pc - 1]`.
- `linha.split(" ")` separa o nome do número.
- O limite de passos protege você de programas que repetem para sempre, como `JUMP 1`.
