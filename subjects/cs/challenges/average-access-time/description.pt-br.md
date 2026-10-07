# Tempo médio de acesso à memória

A memória principal (RAM) é cerca de **100 vezes mais lenta** que o processador. Para esconder isso, os processadores guardam os dados usados recentemente num **cache** pequeno e rápido. Quando o dado está no cache é um **acerto** e leva cerca de 1 nanossegundo; quando não está, é uma **falha**, e o processador também precisa esperar a memória principal.

O tempo médio por acesso é:

> média = tempo do cache + taxa de falha × tempo da memória

Com um cache de 1 ns, memória de 100 ns e taxa de acerto de 95%, a taxa de falha é 5%, então a média é 1 + 0,05 × 100 = **6 ns**: quase 17 vezes mais rápido do que ir sempre à memória.

**Entrada**

Uma linha: o tempo do cache em nanossegundos, o tempo da memória em nanossegundos e a taxa de acerto em porcentagem (de 0 a 100). Qualquer um deles pode ter casas decimais, com ponto.

**Saída**

Duas linhas: `Average: ` e o tempo médio com 2 casas decimais seguido de ` ns`, e `Speedup: ` e tempo da memória ÷ média com 2 casas decimais seguido de `x`.

**O que você precisa saber**

- Transforme a porcentagem numa fração primeiro: 95% é 0,95, então a taxa de falha é 1 − 0,95 = 0,05.
- Todo acesso paga o tempo do cache; só as falhas também pagam o tempo da memória.
- `String.format("%.2f", x)` arredonda para 2 casas decimais.
