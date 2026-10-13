# Crivo de Eratóstenes

Testar divisores de cada número fica lento rápido: até dez milhões são bilhões de divisões. Há mais de 2.000 anos Eratóstenes achou um jeito melhor, ainda usado para fazer tabelas de primos: escreva todos os números e **risque** os múltiplos de cada primo que encontrar. O que sobrar sem risco é primo, e nenhuma divisão é necessária. No C, a lista de números é um array de marcas.

Leia `n` e imprima quantos primos existem até `n`, e o maior deles:

```
30   →   Primes: 10
         Largest: 29
```

(2, 3, 5, 7, 11, 13, 17, 19, 23 e 29.)

**Entrada**

Um número inteiro `n` (2 ≤ n ≤ 10.000.000).

**Saída**

`Primes: ` e a contagem, depois `Largest: ` e o maior primo até `n`.

**Coisas para saber**

- Um array de 10 milhões de marcas `char` ocupa 10 MB. Variáveis locais ficam na pilha, que tem só alguns MB, então declare-o `static` ou fora do `main`; arrays assim começam cheios de zeros.
- Riscar os múltiplos de `i` pode começar em `i × i`. Calcule como `long long`: para `i` perto de 10 milhões, `i × i` não cabe num `int`.
- Cada teste tem 2 segundos. Testar divisores leva vários segundos para 10 milhões; o crivo, bem menos de um.
