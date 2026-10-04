# Contador de palavras

Leia uma linha de texto e imprima quantas **palavras** ela tem. Uma palavra é qualquer grupo de caracteres sem espaços. Os espaços podem aparecer mais de uma vez seguidos, e também no começo ou no fim da linha.

**Entrada**

Uma linha de texto (pode estar vazia).

**Saída**

O número de palavras.

**O que você precisa saber**

- `text.trim()` tira os espaços do começo e do fim.
- `text.split("\\s+")` separa em um ou mais espaços e devolve um array.
