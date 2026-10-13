# Anatomia de um float

Um `float` são 32 bits no formato IEEE 754, usado por quase todo processador:

```
bit 31   | bits 30 … 23 | bits 22 … 0
sinal    | expoente     | mantissa (fração)
```

Um número normal é `(−1)^sinal × 1,mantissa × 2^(expoente − 127)`. Um expoente 0 quer dizer zero ou um **subnormal** (um número minúsculo sem o 1 escondido), e um expoente 255 quer dizer **infinito** ou **nan**. Ver os bits explica por que `0.1` não é exato: a mantissa dele nunca termina em binário.

Para cada número, imprima os bits e os campos:

```
Input: -2.5
Bits: 0xC0200000
Sign: 1
Exponent: 128
Mantissa: 0x200000
Kind: normal, scale 2^1
```

(−2,5 = −1,25 × 2¹, e ,25 é ,01 em binário: os bits de cima da mantissa são `01`.)

**Entrada**

Números, um por linha, até o fim da entrada, como o `strtof` os lê: decimais como `0.1`, notação científica como `1e-40`, e `inf` ou `-inf`.

**Saída**

Para cada número: `Input:` e o texto como foi lido, depois `Bits:` (`0x` e 8 dígitos hexadecimais), `Sign:`, `Exponent:` (o campo de 8 bits), `Mantissa:` (`0x` e 6 dígitos hexadecimais) e `Kind:`, que é `zero`, `subnormal`, `infinity`, `nan`, ou `normal, scale 2^E` com `E = expoente − 127`.

**Coisas para saber**

- `memcpy(&bits, &f, sizeof bits)` copia os bytes do float para um `uint32_t`. Uma atribuição simples converteria o valor.
- Máscaras e deslocamentos tiram os campos: `(bits >> 23) & 0xFF` é o expoente.
- `strtof(text, NULL)` converte o texto no `float` mais próximo.
- Ajudas de `<math.h>` como `frexp` e `isinf` não são permitidas: decodifique os bits.
