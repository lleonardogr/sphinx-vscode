# Agenda unificada

O sistema de reservas de uma sala de reunião mostra cada dia como blocos ocupados. Reuniões que se sobrepõem, ou em que uma termina exatamente quando a próxima começa, formam um bloco só.

Leia as reuniões, em qualquer ordem, cada uma como um minuto de início e uma duração, e imprima:

- quantos **blocos** ocupados existem,
- o tempo **ocupado** total,
- o **maior intervalo livre** entre dois blocos (0 se houver um bloco só).

Uma reunião que começa em `start` e dura `length` minutos ocupa os instantes `start ≤ t < start + length`.

Para as reuniões `8 2`, `1 2`, `15 3`, `2 4` e `10 2`, ou seja, `[8, 10) [1, 3) [15, 18) [2, 6) [10, 12)`, os blocos são `[1, 6)`, `[8, 12)` e `[15, 18)`:

```
blocks: 3
busy: 12
longest free gap: 3
```

**Entrada**

- Linha 1: `n` (1 ≤ n ≤ 200.000)
- Depois `n` linhas com `start` e `length` (0 ≤ start ≤ 1.000.000.000; 1 ≤ length ≤ 100.000)

**Saída**

Três linhas: `blocks: `, `busy: ` e `longest free gap: `, como no exemplo.

**Bom saber**

- Comparar cada reunião com todas as outras é lento demais para 200.000 reuniões. Depois de ordenar pelo início, uma passada basta.
- Um `record Meeting(int start, int end)` e `list.sort(Comparator.comparingInt(Meeting::start))` ordenam pelo início. Com um `int[][]`, use `Arrays.sort(meetings, (a, b) -> Integer.compare(a[0], b[0]))`.
- Uma reunião pode ficar inteira dentro de outra: o fim do bloco é o maior fim visto até agora.
