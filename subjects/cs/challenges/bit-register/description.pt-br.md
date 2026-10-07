# Registrador de 8 bits

Um processador guarda os números com que está trabalhando em **registradores**. Simule um registrador de 8 bits que começa em `00000000` e executa uma lista de comandos. Os bits são numerados de 0 (mais à direita) a 7 (mais à esquerda).

| Comando | Efeito |
|---------|--------|
| `set K` | liga o bit K |
| `clear K` | desliga o bit K |
| `toggle K` | inverte o bit K |
| `shl N` | desloca todos os bits N posições para a esquerda (os bits que saem pela esquerda se perdem) |
| `shr N` | desloca todos os bits N posições para a direita |
| `not` | inverte todos os bits |
| `end` | para |

**Entrada**

Um comando por linha, terminando com `end`. K vai de 0 a 7 e N de 1 a 7.

**Saída**

Depois de cada comando, menos o `end`, o registrador como 8 bits. Para um comando desconhecido, imprima `Unknown command: ` seguido da linha e deixe o registrador como estava.

**O que você precisa saber**

- `1 << k` é uma **máscara** só com o bit k ligado. `valor | mascara` liga o bit, `valor & ~mascara` desliga e `valor ^ mascara` inverte.
- Um `int` tem 32 bits, então depois de `shl` ou `not` mantenha só os 8 de baixo com `valor & 0xFF`.
- Imprima os bits você mesmo, do bit 7 até o bit 0: `Integer.toBinaryString` não vale aqui.
