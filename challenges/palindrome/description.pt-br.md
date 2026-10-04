# É palíndromo?

Um **palíndromo** é uma palavra que se lê igual de frente para trás e de trás para frente, como `level`, `noon` ou `Racecar`. Leia uma palavra e diga se ela é um. Ignore a diferença entre maiúsculas e minúsculas: `Racecar` conta, porque `racecar` invertido continua `racecar`.

**Entrada**

Uma única palavra.

**Saída**

`Palindrome` (é palíndromo) ou `Not a palindrome` (não é).

**O que você precisa saber**

- `word.toLowerCase()` tira a diferença de maiúsculas antes de comparar.
- Compare o primeiro caractere com o último, depois o segundo com o penúltimo, e assim por diante: `word.charAt(i)` com `word.charAt(word.length() - 1 - i)`. Basta ir até a metade.
- Compare Strings com `equals`, nunca com `==`: `a.equals(b)`.
- Uma palavra de uma letra é palíndromo.
