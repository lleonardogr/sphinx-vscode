# Relatório de logs do servidor

*Um teste das unidades 1 a 4: mapas hash, ordenação, dois ponteiros e orçamentos de tempo.*

Toda requisição a um serviço web deixa uma linha de log: quando chegou, que usuário mandou e quanto tempo o servidor levou para responder. Uma vez por dia, o time de operações lê um relatório feito a partir do log inteiro, muitas vezes centenas de milhares de linhas.

Leia o log, em qualquer ordem, e imprima:

- `users: ` quantos usuários diferentes mandaram requisições;
- `top user: ` o usuário com mais requisições (o menor id num empate), e `top user requests: ` quantas;
- `p95 latency: ` a latência que 95% das requisições não passaram: o valor na posição ⌈0,95 × n⌉ − 1 das latências ordenadas, contando a partir de 0 (em inteiros, `(95 * n + 99) / 100 − 1`);
- `busiest minute: ` o maior número de requisições com instantes `t ≤ instante < t + 60`, e `busiest minute starts: ` o `t` mais cedo em que isso acontece (sempre um instante de requisição);
- `longest quiet: ` o maior intervalo entre duas requisições seguidas, em ordem de tempo (0 se houver uma requisição só).

Para as 8 linhas do exemplo, ordenadas por tempo `40 45 100 100 101 130 160 900`:

```
users: 3
top user: 7
top user requests: 4
p95 latency: 2000
busiest minute: 4
busiest minute starts: 45
longest quiet: 740
```

**Entrada**

- Linha 1: `n` (1 ≤ n ≤ 200.000)
- Depois `n` linhas com o instante em segundos (0 a 1.000.000.000), o id do usuário (1 a 1.000.000) e a latência em milissegundos (1 a 10.000)

**Saída**

Sete linhas, como no exemplo.

**Bom saber**

- Qualquer coisa que compare cada requisição com todas as outras é O(n²) e lenta demais para 200.000 linhas.
- Ordene cópias dos instantes e das latências; conte as requisições por usuário num `HashMap<Integer, Integer>`.
- Requisições podem cair no mesmo segundo: todas contam numa janela, e o intervalo entre elas é 0.
