# Estatísticas das palavras

Leia uma linha de texto e mostre informações sobre as palavras dela:

```
Words: 5
Longest: quick
Vowels: 6
```

Essa é a saída para `The quick brown fox jumps`. `quick`, `brown` e `jumps` têm 5 letras; quando há empate, a **primeira** ganha.

**Entrada**

Uma linha com pelo menos uma palavra. As palavras são feitas de letras e separadas por um ou mais espaços. A linha pode começar ou terminar com espaços.

**Saída**

- `Words: n`, o número de palavras
- `Longest: w`, a palavra mais longa, como está escrita na entrada
- `Vowels: v`, quantas letras são `a`, `e`, `i`, `o` ou `u`, maiúsculas ou minúsculas

**O que você precisa saber**

- `trim()` remove os espaços em volta da linha, e `split(" +")` divide em cada grupo de espaços.
- Compare tamanhos com `length()`. Use `>` (e não `>=`) para manter a primeira palavra mais longa.
- `"aeiou".indexOf(c) >= 0` confere se um `char` minúsculo é vogal.
