# Quantos valores?

Leia uma quantidade de bits `n` e imprima quantos valores diferentes `n` bits conseguem guardar, e o maior deles.

Cada bit é 0 ou 1, então 1 bit tem 2 valores. Cada bit a mais **dobra** a quantidade: 2 bits têm 4 valores (`00`, `01`, `10`, `11`), 3 bits têm 8, e 8 bits (um byte) têm 256. Contando a partir do 0, o maior valor é um a menos: **255** para um byte.

**Entrada**

Um número inteiro `n` (1 ≤ n ≤ 62).

**Saída**

Duas linhas: `Values: ` seguido da quantidade de valores, e `Largest: ` seguido do maior valor.

**O que você precisa saber**

- A quantidade de valores é 2 × 2 × … × 2, `n` vezes (2ⁿ). Um laço que dobra um `long` calcula isso.
- Use `long`, não `int`: a partir de 31 bits, a quantidade não cabe num `int`.
- Calcule com um laço: `Math.pow` e o operador `<<` não valem aqui.
