# Conte as operações

Para comparar algoritmos, os cientistas da computação **contam passos** em vez de medir tempo. Leia um número `n` e conte quantas vezes o corpo de cada um destes laços roda:

```java
// Laço simples
for (int i = 0; i < n; i++) { count++; }

// Laços aninhados
for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) { count++; }
}

// Laço que divide ao meio
int m = n;
while (m > 1) { m = m / 2; count++; }
```

Para n = 8 o laço simples roda 8 vezes, os laços aninhados 64 vezes e o laço que divide ao meio 3 vezes (8 → 4 → 2 → 1).

**Entrada**

Um número inteiro `n` (1 ≤ n ≤ 3000).

**Saída**

Três linhas: `Single loop: ` e a contagem dele, `Nested loops: ` e a contagem deles, `Halving loop: ` e a contagem dele.

**O que você precisa saber**

- Escreva os três laços e conte, como acima: um contador por laço.
- O laço simples cresce como n, os aninhados como n² e o que divide ao meio como log₂ n. Experimente n = 1000 e compare.
- Conte rodando os laços: `Math.log` e `Math.pow` não valem aqui.
