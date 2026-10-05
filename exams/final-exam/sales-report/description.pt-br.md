# Relatório de vendas

Leia as vendas de uma empresa e imprima um relatório com streams (sem laços). A receita de uma venda é `quantity × price`.

Para

```
North Pen 10 2.50
South Pen 15 2.50
North Notebook 3 12.00
South Ruler 4 1.25
```

o relatório é

```
Total revenue: 103.50
By region:
  North: 61.00
  South: 42.50
Best seller: Pen (25 units)
```

As regiões são ordenadas pela receita, **da maior para a menor**; no empate, em ordem alfabética.

O **mais vendido** é o produto com mais unidades vendidas no total; no empate, o nome que vem primeiro na ordem alfabética.

**Entrada**

- Linha 1: `n` (pelo menos 1)
- Depois, `n` linhas `REGION PRODUCT QUANTITY PRICE` (uma palavra cada; o preço tem duas casas decimais)

**Saída**

Como acima, valores com duas casas decimais e dois espaços antes de cada região.

**O que você precisa saber**

- `Collectors.groupingBy(chave, Collectors.summingDouble(...))` e `summingInt(...)` somam valores por grupo.
- Ordene entradas de mapa com `Map.Entry.<String, Double>comparingByValue().reversed().thenComparing(Map.Entry.comparingByKey())`.
- `Stream.generate(IO::readln).limit(n)` lê as linhas sem laço.
