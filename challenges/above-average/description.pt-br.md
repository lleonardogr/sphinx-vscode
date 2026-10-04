# Acima da média (for-each)

O **for melhorado**, ou **for-each**, visita cada elemento de um array ou coleção sem usar índice:

```java
for (int number : numbers) {
    // number é cada elemento, um de cada vez
}
```

Leia uma lista de números e imprima a **média** (duas casas decimais) e quantos números ficam **estritamente acima** da média.

**Use um for-each.** Você vai precisar percorrer os números duas vezes: uma para a média e outra para contar.

**Entrada**

- Linha 1: a quantidade de valores `n` (1 ≤ n ≤ 100)
- Linha 2: `n` inteiros separados por um espaço

**Saída**

```
Average: 3.00
Above average: 2
```

**O que você precisa saber**

- Guardar os valores em um array (`int[] numbers = new int[n];`) permite percorrê-los duas vezes.
- Divida como `double` para manter os decimais: `(double) sum / n`.
- "Estritamente acima" quer dizer `>`, não `>=`.
- Imprima duas casas decimais com `"Average: %.2f".formatted(average)`.
