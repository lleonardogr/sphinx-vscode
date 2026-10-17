# Dias mais quentes

Um aplicativo de clima diz, para cada dia, quanto falta para esquentar. Leia as temperaturas diárias e, para cada dia, ache o próximo dia com temperatura **estritamente maior**. O resumo do aplicativo mostra:

- a **maior espera** por um dia mais quente, e o dia mais cedo com essa espera,
- quantos dias **nunca** são seguidos por um mais quente.

Para `30 28 26 27 31 25 25`: o dia 1 (30) espera 4 dias pelo 31, o dia 2 espera 3, os dias 3 e 4 esperam 1, e os dias 5, 6 e 7 nunca ficam mais quentes.

```
longest wait: 4
from day: 1
never warmer: 3
```

**Entrada**

- Linha 1: `n` (1 ≤ n ≤ 200.000)
- Linha 2: `n` temperaturas (−50 a 50)

**Saída**

- `longest wait: ` e a maior espera em dias (0 se nenhum dia esquenta).
- `from day: ` e o dia mais cedo com essa espera, contando a partir de 1, ou `none` se nenhum dia esquenta.
- `never warmer: ` e a contagem.

**Bom saber**

- Conferir os dias seguintes a partir de cada dia é O(n²). Com 200.000 temperaturas iguais, são 20 bilhões de comparações.
- Uma **pilha monotônica** dos dias que ainda esperam resolve numa passada: cada dia entra uma vez e sai no máximo uma vez.
- `Deque<Integer> stack = new ArrayDeque<>()` com `push`, `peek` e `pop`; guarde os números dos dias (índices), não as temperaturas.
