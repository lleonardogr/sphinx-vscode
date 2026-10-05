# Torre de Hanói

Há três pinos, `A`, `B` e `C`. O pino `A` tem `n` discos, o maior embaixo. Leve todos para o pino `C`, seguindo duas regras:

1. Mova um disco por vez (o disco do topo de um pino).
2. Nunca coloque um disco maior em cima de um menor.

Os discos são numerados de `1` (o menor) a `n` (o maior). Para `n = 2`:

```
Move disk 1 from A to B
Move disk 2 from A to C
Move disk 1 from B to C
Total moves: 3
```

**Entrada**

O número de discos `n` (1 ≤ n ≤ 10).

**Saída**

Todos os movimentos, em ordem, e depois `Total moves: m`. Use a solução com menos movimentos (`2ⁿ − 1`), que é a que a ideia recursiva abaixo produz.

**O que você precisa saber**

- A ideia recursiva: para mover `n` discos de `A` para `C`, mova os `n − 1` discos de cima para `B`, mova o disco `n` para `C` e depois mova os `n − 1` discos de `B` para `C`.
- Cada chamada recursiva troca os papéis dos pinos: o mesmo método move discos entre **quaisquer** dois pinos, usando o terceiro como apoio.
- Um campo como `moves`, fora do método, guarda o valor entre todas as chamadas recursivas.
