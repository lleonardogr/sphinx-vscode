## Por que isso importa

Um programa que funciona com 10 entradas de teste pode travar com 10 milhões de entradas reais. A **notação Big O** descreve como o trabalho de um algoritmo cresce conforme a entrada cresce, para você prever isso antes de acontecer e comparar algoritmos sem medir o tempo num computador específico.

## Contando passos, não segundos

Os segundos dependem do computador, mas o número de passos básicos (comparações, somas, voltas de laço) depende só do algoritmo e do tamanho da entrada, que chamamos de **n**. O Big O fica só com a parte que importa quando n fica grande:

- As constantes somem: 3n passos e n passos são ambos **O(n)**.
- Os termos menores somem: n² + 5n + 100 é **O(n²)**, porque para n grande só a parte n² importa.

## As classes comuns

| Big O | Nome | Exemplo |
|-------|------|---------|
| O(1) | constante | ler `array[i]`, somar dois números |
| O(log n) | logarítmica | busca binária |
| O(n) | linear | busca linear, somar uma lista |
| O(n log n) | linearítmica | boa ordenação (`Arrays.sort`) |
| O(n²) | quadrática | laços aninhados sobre a lista, ordenação por seleção |
| O(2ⁿ) | exponencial | testar todos os subconjuntos de n itens |

Quantos passos cada uma dá:

| n | log₂ n | n log₂ n | n² | 2ⁿ |
|---|--------|----------|----|----|
| 10 | 3 | 33 | 100 | 1.024 |
| 1.000 | 10 | 10.000 | 1.000.000 | um número de 302 dígitos |
| 1.000.000 | 20 | 20.000.000 | 10¹² | — |

Um computador faz mais ou menos um bilhão de passos simples por segundo. Para um milhão de itens, a ordenação O(n log n) termina numa fração de segundo, mas uma O(n²) precisa de cerca de 10¹² passos: mais de 15 minutos. Um algoritmo O(2ⁿ) é inviável mesmo para n = 100.

## Lendo o Big O no código

- Um laço sobre n itens: **O(n)**.
- Um laço dentro de outro, os dois sobre n itens: **O(n²)**.
- Um laço que divide (ou dobra) um valor até chegar a 1 (ou a n): **O(log n)**.
- Passos um depois do outro: some e fique com o maior. Um laço O(n) seguido de um O(n²) é O(n²).

```java
for (int i = 0; i < n; i++) { ... }            // O(n)

for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) { ... }        // O(n²)
}

for (int m = n; m > 1; m /= 2) { ... }         // O(log n)
```

## Melhor, pior e caso médio

O Big O normalmente descreve o **pior caso**. A busca linear é O(n) porque o alvo pode ser o último ou nem estar lá, mesmo que às vezes ele seja achado no primeiro passo. Dizer "a busca linear é O(n)" é uma promessa de que ela nunca faz mais do que cerca de n passos.

## Mais rápido nem sempre é melhor

Para entradas pequenas, um algoritmo O(n²) simples pode ser mais rápido que um O(n log n) esperto, porque as constantes que o Big O ignora são menores. O Big O diz o que acontece quando **n cresce**. Prefira a solução simples quando as entradas são pequenas, e a melhor complexidade quando elas podem ser grandes.

## Resumo

- O Big O descreve como o número de passos cresce com o tamanho n da entrada, ignorando constantes e termos pequenos.
- Do rápido para o lento: O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ).
- Um laço é O(n), laços aninhados O(n²), um laço que divide ao meio O(log n).
- O Big O normalmente quer dizer o pior caso, e importa mais quando as entradas são grandes.
