# Contar ocorrências

Leia `n` números para dentro de um array e depois um número **alvo**. Imprima quantas vezes o alvo aparece no array.

**Entrada**

- Linha 1: um inteiro `n` (1 ≤ n ≤ 100)
- Linha 2: `n` inteiros separados por espaços
- Linha 3: o inteiro alvo

**Saída**

Quantas vezes o alvo aparece.

**O que você precisa saber**

- Leia todos os números para o array primeiro e só depois leia o alvo.
- Percorra cada elemento e some 1 em um contador quando ele for igual: `if (numbers[i] == target) count++;`
- Se o alvo nunca aparece, a resposta é `0`.
