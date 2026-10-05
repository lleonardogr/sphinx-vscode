# Adivinhe o número

Um amigo escolheu um número secreto e você está tentando adivinhar. Depois de cada palpite ele diz se o segredo é maior ou menor. Escreva o juiz.

Leia o segredo e depois leia os palpites um a um:

- um palpite abaixo do segredo imprime `Too low`
- um palpite acima do segredo imprime `Too high`
- o palpite certo imprime `Correct! You needed N guesses.` e o jogo acaba

Para o segredo `42` e os palpites `50`, `25`, `42`:

```
Too high
Too low
Correct! You needed 3 guesses.
```

**Entrada**

- Linha 1: o número secreto (1 a 100)
- Depois, um palpite por linha. O último palpite é sempre o certo.

**Saída**

Uma linha por palpite, como acima. Com um palpite só, a última linha continua sendo `Correct! You needed 1 guesses.`

**O que você precisa saber**

- Um `while` repete enquanto a condição for verdadeira, o que combina com "continue até acertar".
- Guarde um contador e some `1` a cada palpite.
- `break` sai do laço antes, se você preferir um `while (true)`.
