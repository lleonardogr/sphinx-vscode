# Tabuada

Leia um número `n` e imprima a tabuada dele, de 1 a 10.

**Entrada**

Um inteiro `n`.

**Saída**

Dez linhas neste formato (exemplo para `3`):

```
3 x 1 = 3
3 x 2 = 6
...
3 x 10 = 30
```

**O que você precisa saber**

- Um laço de `1` a `10` dá cada multiplicador.
- Monte a linha juntando os valores com `+`: `n + " x " + i + " = " + (n * i)`. Os parênteses fazem o Java multiplicar antes de juntar o texto.
- Ou formate: `"%d x %d = %d".formatted(n, i, n * i)`.
