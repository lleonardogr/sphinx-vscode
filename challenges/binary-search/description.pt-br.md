# Busca binária

Procurar um valor em um array **ordenado** não exige olhar todos os elementos. A **busca binária** olha o elemento do meio e descarta a metade que não pode ter o valor, de novo e de novo.

Use exatamente este algoritmo e conte os **passos**:

1. `low = 0`, `high = n - 1`
2. Enquanto `low <= high`: `mid = (low + high) / 2`. Isso é um passo.
   - `numbers[mid]` é igual ao valor: achou.
   - `numbers[mid]` é menor: `low = mid + 1`.
   - `numbers[mid]` é maior: `high = mid - 1`.

Para `2 5 8 12 16 23 38`, buscar `23` olha o índice 3 (`12`) e depois o índice 5 (`23`):

```
23 found at index 5, steps: 2
```

**Entrada**

- Linha 1: `n` (1 ≤ n ≤ 100.000)
- Linha 2: `n` inteiros diferentes em ordem crescente
- Linha 3: `q`, o número de buscas; depois `q` linhas com um valor cada

**Saída**

Para cada valor: `x found at index i, steps: s`, ou `x not found, steps: s`.

**O que você precisa saber**

- Cada passo corta o intervalo pela metade, então mesmo 100.000 elementos precisam de no máximo 17 passos. Um laço por todos os elementos levaria até 100.000.
- `(low + high) / 2` usa divisão inteira, então `mid` é sempre um índice válido.
- Escreva a busca você mesmo, sem `Arrays.binarySearch`.
