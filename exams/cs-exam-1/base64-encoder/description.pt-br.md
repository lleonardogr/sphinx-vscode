# Codificador Base64

E-mail, páginas web e JSON foram feitos para texto, não para bytes brutos. Para mandar uma imagem ou um arquivo por eles, os bytes são escritos em **Base64**: um texto com só 64 caracteres seguros. Você o vê em anexos de e-mail, em URLs `data:` e dentro de tokens de login.

Os 64 caracteres são, na ordem do seu valor de 0 a 63:

```
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/
```

Para codificar, pegue os bytes **de 3 em 3**. 3 bytes são 24 bits, que se dividem em **quatro grupos de 6 bits**, e cada grupo (0 a 63) vira um caractere. Para `Man`:

| | `M` | `a` | `n` |
|---|---|---|---|
| ASCII | 77 | 97 | 110 |
| Bits | `01001101` | `01100001` | `01101110` |

Os 24 bits `010011 010110 000101 101110` são 19, 22, 5 e 46: **`TWFu`**.

Se sobrarem 1 ou 2 bytes no fim, acrescente bits zero para completar o último grupo de 6 bits, e complete com `=` para o tamanho da saída ser múltiplo de 4: `Ma` é `TWE=` e `M` é `TQ==`.

Leia uma linha de texto e imprima-a em Base64.

**Entrada**

Uma linha de texto ASCII, com pelo menos 1 caractere.

**Saída**

A codificação Base64 dos bytes do texto.

**Para saber**

- O código ASCII de um caractere é o valor do seu `char`: `(int) 'M'` é 77.
- `x >> 6` descarta os 6 bits mais baixos de `x`, e `x & 63` mantém só eles.
