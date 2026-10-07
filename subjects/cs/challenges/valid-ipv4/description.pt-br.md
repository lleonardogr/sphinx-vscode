# Endereço IPv4 válido

Todo dispositivo na internet tem um **endereço IP**. Um endereço IPv4 tem 4 bytes, escritos como 4 números de 0 a 255 separados por pontos, como `192.168.1.1`.

Leia uma linha e diga se ela é um endereço IPv4 válido. Ele é válido quando:

- tem exatamente **4 partes** separadas por pontos;
- cada parte tem **1 a 3 dígitos** e mais nada;
- cada parte é um número de **0 a 255**;
- nenhuma parte tem **zero à esquerda** (`01` é inválido, mas `0` serve).

**Entrada**

Uma linha de texto, sem espaços.

**Saída**

`Valid` ou `Invalid`.

**O que você precisa saber**

- `split("\\.")` separa nos pontos (um `"."` sozinho quer dizer "qualquer caractere" para o `split`). Acrescente `-1`, `split("\\.", -1)`, para que partes vazias no fim não sejam descartadas.
- `Character.isDigit(c)` diz se um caractere é um dígito.
- Confira as regras você mesmo: expressões regulares e classes de `java.net` não valem aqui.
