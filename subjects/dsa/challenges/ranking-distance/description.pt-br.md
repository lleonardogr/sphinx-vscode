# Distância entre rankings

Sistemas de recomendação comparam gostos pelo quanto as pessoas ordenam as mesmas coisas de forma diferente. Ana e Bruno ordenaram os mesmos `n` filmes. Conte os pares de filmes que eles colocaram em **ordem diferente**: isso se chama distância de Kendall tau.

Os filmes são numerados pelo ranking da Ana: o filme 1 é o favorito dela e o filme `n` o de que ela menos gosta. A lista do Bruno traz os mesmos filmes, do favorito dele ao de que ele menos gosta. Um par está em ordem diferente quando o Bruno coloca primeiro o filme de número maior.

Depois imprima o quanto eles concordam: a parte de todos os n(n − 1)/2 pares que está na mesma ordem, como porcentagem com uma casa decimal.

Para a lista do Bruno `2 1 5 3 4`, os pares (2, 1), (5, 3) e (5, 4) estão invertidos. São 3 dos 10 pares:

```
different pairs: 3
agreement: 70.0%
```

**Entrada**

- Linha 1: `n` (1 ≤ n ≤ 200.000)
- Linha 2: o ranking do Bruno: os números de 1 a `n`, cada um uma vez, na ordem dele

**Saída**

- `different pairs: ` e a contagem.
- `agreement: ` e 100 × (pares − diferentes) / pares com uma casa decimal, depois `%`. Com `n = 1` não há pares: imprima `100.0%`.

**Bom saber**

- Esses pares são as **inversões** da lista. O merge sort consegue contá-las enquanto ordena, em O(n log n).
- Com 200.000 filmes há uns 2 × 10¹⁰ pares: use `long`.
- `String.format("%.1f%%", valor)` imprime uma casa decimal e um `%`.
