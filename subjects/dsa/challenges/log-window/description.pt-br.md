# Janela de log

Um servidor web escreve uma linha de log por requisição, em ordem de tempo. Painéis vivem fazendo perguntas como "quantas requisições chegaram entre o segundo 1.200 e o segundo 1.500?", milhares de vezes, então percorrer o log inteiro a cada pergunta é lento demais.

Leia os instantes ordenados e `q` janelas `a b`. Para cada janela, conte as requisições com `a ≤ t ≤ b`. Depois imprima o **total** de todas as contagens e a contagem da janela **mais movimentada**.

Para os instantes `2 4 4 4 7 9` e as janelas `4 4` (3 requisições), `3 8` (4 requisições: 4, 4, 4 e 7) e `10 20` (nenhuma):

```
total: 7
busiest: 4
```

**Entrada**

- Linha 1: `n` (1 ≤ n ≤ 200.000)
- Linha 2: `n` instantes em ordem não decrescente (0 ≤ t ≤ 1.000.000.000); o mesmo segundo pode se repetir
- Linha 3: `q` (1 ≤ q ≤ 200.000)
- Depois `q` linhas com `a` e `b` (0 ≤ a ≤ b ≤ 1.000.000.000)

**Saída**

`total: ` e a soma das contagens, depois `busiest: ` e a maior contagem.

**Bom saber**

- Um laço sobre os `n` instantes para cada uma das `q` janelas dá 4 × 10¹⁰ passos no maior teste. A busca binária responde uma janela em uns 2 × 18 passos.
- Ache duas fronteiras: o primeiro índice com `t ≥ a` e o primeiro índice com `t > b`. A contagem é a diferença entre eles.
- O total pode chegar a 4 × 10¹⁰, acima do limite do `int`, de uns 2,1 × 10⁹: use um `long`.
- Escreva a busca você mesmo: `Arrays.binarySearch` acha *algum* valor igual, não o primeiro.
