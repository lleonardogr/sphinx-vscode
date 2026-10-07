# Decodificador de instruções

Um processador executa **código de máquina**: instruções guardadas como bits. Imagine um processador minúsculo cujas instruções têm 8 bits. Os 4 primeiros bits são o **opcode** (qual instrução) e os 4 últimos são o **operando** (um número de 0 a 15 que a instrução usa).

| Opcode | Instrução | Operando |
|--------|-------------|---------|
| `0000` | `HALT` | nenhum |
| `0001` | `LOAD` | um número |
| `0010` | `ADD` | um número |
| `0011` | `SUB` | um número |
| `0100` | `STORE` | um número |
| `0101` | `JUMP` | um número |
| `0110` | `JZ` | um número |
| `0111` | `OUT` | nenhum |

Então `00010101` é o opcode `0001` = `LOAD` com operando `0101` = 5: **LOAD 5**. Os opcodes de `1000` a `1111` não são usados.

Leia algumas instruções e decodifique-as.

**Entrada**

O número de instruções `n` (1 ≤ n ≤ 20), depois uma instrução por linha.

**Saída**

Para cada instrução, uma linha:

- o nome da instrução, seguido de um espaço e do operando em decimal quando ela tem um, como `LOAD 5` ou `HALT`;
- `Unknown opcode ` seguido dos 4 bits do opcode, para um opcode que não está na tabela;
- `Invalid instruction` se a linha não tiver exatamente 8 caracteres, cada um `0` ou `1`.

**O que você precisa saber**

- O ciclo de **busca–decodificação–execução** começa exatamente assim: o processador lê os bits e descobre o que eles pedem.
- `instrucao.substring(0, 4)` é o opcode e `instrucao.substring(4)` o operando.
- Um array `String[] names = {"HALT", "LOAD", …}` deixa você achar um nome pelo número do opcode.
