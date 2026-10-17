# Pico de carga

Um servidor registra sua carga a cada segundo. A manutenção precisa de `k` segundos seguidos, e é mais segura quando o **pico** de carga nessa janela é o menor possível. Ache a janela cuja maior carga é a menor.

Para `n = 8`, `k = 3` e as cargas `40 75 31 22 28 90 60 35`, os picos das janelas são 75, 75, 31, 90, 90 e 90. A melhor janela começa no segundo 3:

```
best start: 3
best peak: 31
```

**Entrada**

- Linha 1: `n` e `k` (1 ≤ k ≤ n ≤ 200.000)
- Linha 2: `n` cargas (0 a 1.000.000), uma por segundo

**Saída**

`best start: ` e o segundo em que a melhor janela começa, contando a partir de 1 (a mais cedo num empate), depois `best peak: ` e o pico dela.

**Bom saber**

- Recalcular o máximo de cada janela é O(n·k): com 200.000 segundos e janelas de 100.000, são 10¹⁰ passos.
- Um **deque monotônico** de índices mantém o máximo de cada janela na frente, com cada índice entrando uma vez e saindo no máximo uma vez: O(n).
- `ArrayDeque` funciona nas duas pontas: `peekFirst`, `pollFirst`, `peekLast`, `pollLast` e `offerLast`.
