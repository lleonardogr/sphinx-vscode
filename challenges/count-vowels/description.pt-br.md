# Contar vogais

Leia uma linha de texto e conte as **vogais**: `a`, `e`, `i`, `o` e `u`, minúsculas ou maiúsculas. O resto (outras letras, espaços, dígitos, pontuação) não conta. Por exemplo, `Hello World` tem 3 vogais.

**Entrada**

Uma linha de texto.

**Saída**

O número de vogais.

**O que você precisa saber**

- `text.length()` é o número de caracteres, e `text.charAt(i)` é o caractere na posição `i`, começando do 0.
- Um `char` é escrito com aspas simples, `'a'`, e comparado com `==`.
- `Character.toLowerCase(c)` (ou `text.toLowerCase()` antes) faz você precisar testar só as vogais minúsculas.
- `"aeiou".indexOf(c) >= 0` é um jeito curto de perguntar "`c` é uma vogal?".
