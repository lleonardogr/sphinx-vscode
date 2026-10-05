# Aprovado ou reprovado (partitioningBy)

Separe uma turma entre quem foi **aprovado** (nota 60 ou mais) e quem foi **reprovado**, e calcule a média, usando streams e sem laços.

Para `ana:72 bruno:45 carla:60`:

```
Passed (2): ana, carla
Failed (1): bruno
Average: 59.0
```

**Entrada**

Uma linha de entradas `nome:nota` separadas por espaços (notas de 0 a 100).

**Saída**

- `Passed (k): nomes` na ordem da entrada, ou `Passed (0): none`
- `Failed (k): nomes` na ordem da entrada, ou `Failed (0): none`
- `Average: x` com uma casa decimal

**O que você precisa saber**

- `Collectors.partitioningBy(predicado)` divide um stream em um `Map<Boolean, List<T>>` com exatamente duas chaves, `true` e `false`, mesmo quando uma lista está vazia.
- `Collectors.joining(", ")` junta Strings com um separador.
- `mapToInt(Student::score).average()` devolve um `OptionalDouble`; `getAsDouble()` dá o valor.
