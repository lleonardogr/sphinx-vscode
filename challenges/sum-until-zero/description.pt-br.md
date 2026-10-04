# Somar até o zero (do-while)

Um laço **`do-while`** executa o corpo primeiro e testa a condição **depois**, então o corpo sempre roda pelo menos uma vez:

```java
do {
    // roda pelo menos uma vez
} while (condicao);
```

Isso é perfeito para "ler valores até aparecer um sinal de parada". Leia números inteiros, um por linha, até aparecer um `0`. Depois imprima quantos números vieram **antes** do `0` e a soma deles.

**Use um laço `do-while`.**

**Entrada**

Um inteiro por linha. A última linha é sempre `0`, e ela também pode ser a primeira.

**Saída**

```
Count: <quantos números antes do 0>
Sum: <a soma deles>
```

**O que você precisa saber**

- No Java moderno, `IO.readln()` lê a próxima linha a cada vez que você chama.
