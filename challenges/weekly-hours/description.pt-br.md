# Horas de estudo na semana (EnumMap)

Um **`enum`** é um tipo com um conjunto fixo de valores, como os dias da semana. Um **`EnumMap`** é um mapa cujas chaves são valores de um enum. Ele é rápido e sempre percorre os valores na ordem em que foram declarados.

O enum `Day` já está escrito. Some as horas estudadas em cada dia.

**Entrada**

- Linha 1: a quantidade de sessões de estudo `n` (pelo menos 1)
- Próximas `n` linhas: um dia (`MONDAY` … `SUNDAY`) e uma quantidade de horas (pelo menos 1)

**Saída**

Os sete dias **na ordem da semana**, com o total de horas de cada um (0 se não houver), e depois o dia com mais horas. Se houver empate, escolha o dia que vem primeiro na semana.

```
MONDAY: 3
TUESDAY: 0
...
SUNDAY: 0
Busiest: WEDNESDAY
```

**O que você precisa saber**

- `EnumMap<Day, Integer> map = new EnumMap<>(Day.class);`
- `Day.values()` devolve todos os dias em ordem. `Day.valueOf("MONDAY")` transforma o texto em um `Day`.
- Imprimir um valor de enum imprime o nome dele.
