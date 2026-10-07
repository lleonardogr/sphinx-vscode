# Tabela-verdade

Uma **porta lógica** recebe bits e devolve um bit. A **tabela-verdade** dela lista a saída para cada combinação de entradas:

| Porta | A saída é 1 quando… |
|-------|---------------------|
| `AND` | as duas entradas são 1 |
| `OR` | pelo menos uma entrada é 1 |
| `XOR` | exatamente uma entrada é 1 |
| `NAND` | não são as duas 1 (o contrário do AND) |
| `NOR` | nenhuma é 1 (o contrário do OR) |

Leia o nome de uma porta e imprima a tabela-verdade dela.

**Entrada**

Uma linha com o nome da porta, em maiúsculas.

**Saída**

Uma linha de cabeçalho `A B OUT`, depois as quatro linhas `A B OUT` para A e B = `0 0`, `0 1`, `1 0` e `1 1`, nessa ordem. Para um nome que não está na tabela (inclusive em minúsculas), imprima `Unknown gate: ` seguido dele.

**O que você precisa saber**

- Laços aninhados `for (int a = 0; a <= 1; a++)` e `for (int b = 0; b <= 1; b++)` dão as linhas em ordem.
- `&&`, `||`, `^` e `!` do Java são AND, OR, XOR e NOT para booleanos.
- `cond ? 1 : 0` transforma um booleano de volta num bit.
