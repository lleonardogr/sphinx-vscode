# Hexadecimal para decimal

O hexadecimal aparece em cores da web (`#FF8800`), endereços de memória e códigos de erro como `0x80070005`.

Leia um número em **hexadecimal** (base 16) e imprima o valor dele em **decimal**.

Os dígitos hex vão de `0` a `9` e depois de `A` (10) a `F` (15), maiúsculos ou minúsculos. Cada dígito vale 16 vezes o dígito à sua direita: `2F` é 2 × 16 + 15 = **47**.

O número pode começar com `0x` ou `0X`, como no código. Se um caractere não for um dígito hex, imprima `Invalid hex digit: ` seguido do **primeiro** caractere assim, do jeito que foi digitado.

**Entrada**

Um número hexadecimal com 1 a 15 dígitos, que pode começar com `0x` ou `0X`.

**Saída**

O valor dele em decimal, ou `Invalid hex digit: G`.

**O que você precisa saber**

- `"0123456789ABCDEF".indexOf(Character.toUpperCase(c))` dá o valor de um dígito hex, ou `-1` quando `c` não é um.
- Da esquerda para a direita, `value = value * 16 + digit` monta o número um dígito por vez.
- 15 dígitos hex não cabem em um `int`: use um `long`. Faça a conversão você mesmo: `Long.parseLong(texto, 16)` não vale aqui.
