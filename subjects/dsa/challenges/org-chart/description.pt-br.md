# Organograma

O organograma de uma empresa é uma **árvore**: o CEO na raiz, e todo outro funcionário tem exatamente um gerente. O RH quer três números dele: quantos níveis ele tem, que nível tem mais pessoas e quantos funcionários não têm ninguém subordinado a eles.

Os funcionários são numerados de 1 a `n`; o funcionário 1 é o CEO, e todo gerente tem um número **menor** que o das pessoas subordinadas a ele.

Para 10 funcionários cujos gerentes (dos funcionários 2 a 10) são `1 1 2 2 3 4 4 5 5`, os níveis são {1}, {2, 3}, {4, 5, 6} e {7, 8, 9, 10}:

```
levels: 4
widest level: 4
widest level size: 4
no reports: 5
```

**Entrada**

- Linha 1: `n` (1 ≤ n ≤ 200.000)
- Linha 2: os gerentes dos funcionários 2 a `n`, em ordem (vazia quando `n` é 1)

**Saída**

- `levels: ` e o número de níveis (o CEO é o nível 1).
- `widest level: ` e o nível com mais pessoas (o mais baixo num empate), e `widest level size: ` e quantas.
- `no reports: ` e quantos funcionários não gerenciam ninguém.

**Bom saber**

- A árvore pode ser uma corrente só, com 200.000 níveis. Subir até o CEO a partir de cada funcionário vira O(n²).
- Como os gerentes vêm primeiro, uma passada calcula cada nível a partir do nível do gerente.
- Um `int[]` indexado pelo número do funcionário serve de árvore: `manager[i]`, `level[i]`.
