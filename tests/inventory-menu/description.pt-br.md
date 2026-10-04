# Menu do estoque

Monte um aplicativo de **estoque de loja** com menu. Ele controla quantas unidades de cada produto existem. Este teste combina **condicionais**, **laços**, **strings**, um **mapa** e os seus próprios **métodos**.

**O que o seu programa faz**

1. Imprime o menu **uma vez**, no início:

   ```
   === Inventory ===
   1. Add stock
   2. Sell
   3. Show inventory
   4. Search
   0. Exit
   ```

2. Depois lê opções, uma por linha, até a opção ser `0`:

| Opção | Lê | Imprime |
|-------|----|---------|
| `1` | uma linha `<produto> <quantidade>` | `<produto>: <novo total>` |
| `2` | uma linha `<produto> <quantidade>` | `Sold <quantidade> <produto>, <restante> left`. Veja as regras abaixo |
| `3` | nada | cada produto como `<produto>: <quantidade>`, **ordenados pelo nome**, e depois `Total units: <soma>`. Se não houver produtos: `Inventory is empty` |
| `4` | uma linha com um texto | todo produto cujo nome **contém** o texto, como `<produto>: <quantidade>`, ordenados pelo nome, ou `No matches` |
| `0` | nada | `Goodbye!`, e o programa termina |
| qualquer outra | nada | `Invalid option` |

**Regras**

- Nomes de produtos são uma palavra e **não diferenciam maiúsculas**: `Apple`, `APPLE` e `apple` são o mesmo produto. Imprima sempre em **minúsculas**. O texto da busca também não diferencia maiúsculas.
- Uma quantidade precisa ser **maior que 0**. Senão, imprima `Invalid quantity` e não mude nada (nas opções `1` e `2`).
- Vender um produto que não está no estoque imprime `<produto> not found`.
- Vender mais do que há no estoque imprime `Not enough <produto> (only <quantidade> left)` e não muda nada.
- Quando o estoque de um produto chega a `0`, tire ele do estoque.

**Exemplo**

Entrada:

```
1
Apple 5
1
banana 3
1
apple 2
2
apple 10
2
banana 3
3
4
an
0
```

Saída:

```
=== Inventory ===
1. Add stock
2. Sell
3. Show inventory
4. Search
0. Exit
apple: 5
banana: 3
apple: 7
Not enough apple (only 7 left)
Sold 3 banana, 0 left
apple: 7
Total units: 7
No matches
Goodbye!
```

**O que você precisa saber**

- Um `TreeMap<String, Integer>` mantém as chaves ordenadas, então o estoque já sai em ordem de nome.
- `map.getOrDefault(nome, 0)`, `map.put(nome, valor)`, `map.remove(nome)` e `map.containsKey(nome)` cobrem quase tudo o que você precisa.
- `text.toLowerCase()` e `name.contains(text)` ajudam com os nomes e a busca.
- Métodos pequenos, como `void printItems(Map<String, Integer> items)`, deixam o laço do menu fácil de ler.
