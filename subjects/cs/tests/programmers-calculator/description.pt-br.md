# Calculadora de programador

Abra a calculadora do Windows ou do macOS e mude para o modo **Programador**: ela mostra o mesmo número em binário, hexadecimal e decimal ao mesmo tempo, para um tamanho em bits escolhido. Programadores a usam para ler memória, cores e máscaras de rede. Construa uma pequena.

A calculadora guarda um valor, com `width` bits. Ela começa com 8 bits e o valor 0. Cada linha é um comando:

| Comando | O que faz |
|---|---|
| `dec N` | define o valor como o número decimal `N`, que pode ser negativo |
| `hex H` | define o valor como o número hexadecimal `H` (dígitos `0`–`9` e `A`–`F`, maiúsculos ou minúsculos) |
| `bin B` | define o valor como o número binário `B` |
| `add N` | soma o número decimal `N` |
| `sub N` | subtrai o número decimal `N` |
| `width W` | muda a largura para `8`, `16` ou `32` bits |
| `quit` | termina o programa |

Os valores sempre **dão a volta** na largura: só os `width` bits mais baixos ficam, como no hardware de verdade. Com 8 bits, `dec 300` fica com 300 − 256 = 44, e `dec -1` dá `1111 1111`. O `N` de `add` e `sub` dá a volta do mesmo jeito antes, então com 8 bits `add -1` soma `1111 1111`.

Depois de cada comando (menos `quit`), imprima o valor do jeito que a calculadora mostra:

```
bin 1100 1000 | hex C8 | unsigned 200 | signed -56
```

- `bin`: todos os `width` bits, em grupos de 4 separados por espaços.
- `hex`: `width / 4` dígitos, maiúsculos, com zeros à esquerda.
- `unsigned`: os bits lidos como um número de 0 a 2^width − 1 (sem sinal).
- `signed`: os bits lidos em complemento de dois, de −2^(width−1) a 2^(width−1) − 1 (com sinal).

`add` e `sub` também informam as **flags** que uma CPU liga, no fim da linha:

- ` | carry` (no `add`) ou ` | borrow` (no `sub`) quando o resultado **sem sinal** não cabe: passou de 2^width − 1 ou ficou abaixo de 0.
- ` | overflow` quando o resultado **com sinal** não cabe. Com 8 bits, 100 + 100 dá overflow, porque 200 é mais que 127.

Quando os dois acontecem, carry ou borrow vem primeiro.

`width` mantém os bits: uma largura maior acrescenta zeros à esquerda, uma menor descarta os bits mais à esquerda. Então `-56` com 8 bits vira `200` com 16 bits.

Para um comando errado, imprima a mensagem e deixe o valor como estava: `Invalid hex` ou `Invalid binary` quando um dígito não é válido, `Invalid width` para uma largura que não seja 8, 16 ou 32, e `Unknown command` para qualquer outra coisa.

**Exemplo**

```
dec 100
add 100
add 100
width 16
sub 300
quit
```

imprime

```
bin 0110 0100 | hex 64 | unsigned 100 | signed 100
bin 1100 1000 | hex C8 | unsigned 200 | signed -56 | overflow
bin 0010 1100 | hex 2C | unsigned 44 | signed 44 | carry
bin 0000 0000 0010 1100 | hex 002C | unsigned 44 | signed 44
bin 1111 1111 0000 0000 | hex FF00 | unsigned 65280 | signed -256 | borrow
```

O segundo `add 100` dá 300, que não cabe em 8 bits sem sinal (carry) e dá a volta para 44. Lido com sinal, é −56 + 100 = 44, que cabe: sem overflow.

**Entrada**

Um comando por linha, terminando com `quit`. Os números decimais cabem num `long`; o hexadecimal tem no máximo 16 dígitos e o binário no máximo 64.

**Saída**

Uma linha por comando, como acima.

**Para saber**

- Um `long` guarda qualquer valor de 32 bits, com ou sem sinal, então faça as contas em `long`.
- Os `w` bits mais baixos de `x`: `x & ((1L << w) - 1)`, o que também funciona quando `x` é negativo.
- `Character.digit(c, 16)` dá o valor de um dígito hexadecimal, ou −1 quando `c` não é um.
