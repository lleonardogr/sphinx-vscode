# CRC-32

Quando chega um arquivo ZIP, uma imagem PNG ou um quadro Ethernet, quem recebe recalcula um **CRC-32**, um valor de verificação de 32 bits, e compara com o que foi enviado. Um único bit trocado dá um CRC completamente diferente. Ele é calculado só com deslocamentos e XOR, um bit por vez:

```
crc = 0xFFFFFFFF
para cada byte:
    crc = crc XOR byte
    repita 8 vezes:
        se o bit mais baixo de crc for 1:  crc = (crc >> 1) XOR 0xEDB88320
        senão:                             crc = crc >> 1
resultado = crc XOR 0xFFFFFFFF
```

Este é o CRC-32 do ZIP, do PNG e da Ethernet; o valor de verificação usual é o CRC de `123456789`:

```
123456789   →   cbf43926 length=9
hello       →   3610a686 length=5
```

**Entrada**

Linhas de texto ASCII até o fim da entrada, cada uma com até 1000 caracteres (talvez vazia). A última linha pode não ter quebra de linha.

**Saída**

Para cada linha, o CRC-32 dela com 8 dígitos hexadecimais minúsculos (`%08x`), e depois ` length=` e o número de bytes. A quebra de linha não faz parte da linha.

**Coisas para saber**

- Use `uint32_t` de `<stdint.h>`: um tipo sem sinal, então o `>>` empurra zeros para dentro.
- `crc & 1u` é o bit mais baixo.
- Uma linha vazia tem CRC `00000000`.
