# Detector de overflow

Um `int` tem 32 bits, então guarda números de **−2.147.483.648** a **2.147.483.647**. Quando uma conta passa disso, o Java não reclama: os bits dão a volta e `2147483647 + 1` dá `-2147483648`. Isso se chama **overflow** (estouro).

Leia uma conta com dois valores `int` e imprima o resultado, ou `Overflow` se o resultado de verdade não couber num `int`.

**Entrada**

Uma linha: um número, um espaço, um operador (`+`, `-` ou `*`), um espaço e outro número. Os dois números cabem num `int`.

**Saída**

O resultado, ou `Overflow`.

**O que você precisa saber**

- Um `long` tem 64 bits, então o resultado de quaisquer dois valores `int` cabe nele. Calcule com `long` e depois compare com `Integer.MIN_VALUE` e `Integer.MAX_VALUE`.
- Converta **antes** de calcular: `(long) a * b` multiplica como `long`, mas `(long) (a * b)` estoura primeiro.
- Detecte você mesmo: `Math.addExact`, `Math.multiplyExact` e `BigInteger` não valem aqui.
