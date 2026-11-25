# Períodos do orçamento

Um aplicativo de finanças pessoais registra quanto seu saldo mudou a cada dia, para cima ou para baixo. Ele procura **períodos**, sequências de dias seguidos, cujas mudanças somam exatamente `k`: com `k = 0`, os trechos em que gastos e receitas se anularam.

Conte esses períodos e ache o mais longo.

Para `k = 5` e as mudanças `2 3 -1 4 -3 5`, quatro períodos somam 5: os dias 1–2 (2 + 3), os dias 1–5, os dias 3–6 e o dia 6 sozinho. O mais longo é o dos dias 1–5:

```
periods: 4
longest: 5
```

**Entrada**

- Linha 1: `n` e `k` (1 ≤ n ≤ 200.000; −1.000.000.000 ≤ k ≤ 1.000.000.000)
- Linha 2: `n` mudanças diárias (−1.000 a 1.000)

**Saída**

`periods: ` e quantos períodos somam `k`, depois `longest: ` e o número de dias do mais longo (0 se não houver nenhum).

**Bom saber**

- Somar cada período é O(n²): 20 bilhões de períodos para 200.000 dias.
- Com somas de prefixo, os dias `i+1..j` somam `prefix[j] − prefix[i]`, e um `HashMap<Long, Integer>` das somas de prefixo vistas até agora acha os inícios certos numa consulta.
- Pode haver mais de 2 × 10¹⁰ períodos (tudo zero e `k = 0`): use `long` na contagem e nos totais.
