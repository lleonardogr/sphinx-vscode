# Anagramas

Dois textos são **anagramas** quando um usa exatamente as mesmas letras do outro, só que em outra ordem. `listen` e `silent` são anagramas; `aab` e `abb` não, porque a quantidade de `a` e de `b` é diferente.

Maiúsculas e minúsculas contam como a mesma letra, e os espaços são ignorados, então `Dormitory` e `dirty room` são anagramas.

**Entrada**

Duas linhas, cada uma com um texto de letras e espaços.

**Saída**

`Anagrams` ou `Not anagrams`.

**O que você precisa saber**

- `toLowerCase()` e `replace(" ", "")` deixam os textos limpos para comparar.
- Um `char` é um número por baixo, então dá para percorrer letras: `for (char c = 'a'; c <= 'z'; c++)`.
- Conte quantas vezes uma letra aparece com um laço e `charAt(i) == c`. Resolva sem ordenar arrays.
