# Limitador de requisições

APIs se protegem com **limites de taxa**: "no máximo L requisições em quaisquer w segundos". Antes de ligar um, uma engenheira reproduz o tráfego de ontem para ver o quanto ele ficou movimentado e quantas requisições o limite teria recusado.

Leia `n` instantes de requisição, em segundos e em qualquer ordem, e descubra duas coisas:

1. **A janela mais movimentada**: o maior número de requisições em `w` segundos seguidos, ou seja, instantes com `s ≤ t < s + w`, e o `s` mais cedo em que uma janela assim começa. (`s` é sempre um dos instantes das requisições.)
2. **O que o limitador recusa**: passando pelas requisições em ordem de tempo, uma requisição no instante `t` é aceita quando menos de `L` requisições *aceitas* têm instantes com `t − w < instante ≤ t`. Senão ela é recusada, e não conta contra as requisições seguintes.

Para `w = 10`, `L = 2` e os instantes `14 1 5 25 12 3 13`, ordenados `1 3 5 12 13 14 25`:

- A janela que começa em 5 tem 5, 12, 13 e 14: 4 requisições, mais que qualquer outra.
- O limitador aceita 1 e 3, recusa 5 (1 e 3 estão nos últimos 10 segundos), aceita 12 e 13, recusa 14 (12 e 13) e aceita 25.

```
busiest start: 5
busiest count: 4
rejected: 2
```

**Entrada**

- Linha 1: `n`, `w` e `L` (1 ≤ n ≤ 200.000; 1 ≤ w ≤ 1.000.000.000; 1 ≤ L ≤ n)
- Linha 2: `n` instantes de requisição (0 ≤ t ≤ 1.000.000.000), em qualquer ordem; o mesmo segundo pode se repetir

**Saída**

Três linhas: `busiest start: `, `busiest count: ` e `rejected: `, como no exemplo.

**Bom saber**

- Ordene os instantes primeiro: aqui pode usar `Arrays.sort` (a próxima unidade mostra como a ordenação funciona).
- **Dois ponteiros**: quando o início de uma janela anda para a direita, o fim dela também só anda para a direita, então os dois atravessam o array uma vez.
- As requisições aceitas já ficam em ordem de tempo conforme você as aceita, então outro par de ponteiros resolve o limitador.
- Requisições no mesmo segundo são tratadas uma de cada vez, em qualquer ordem: elas são idênticas.
