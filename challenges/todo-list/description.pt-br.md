# Lista de tarefas (ArrayList)

Arrays têm tamanho fixo. Um **`ArrayList`** cresce e diminui conforme você adiciona e remove itens. Use um para cuidar de uma lista de tarefas.

**Entrada**

- Linha 1: a quantidade de comandos `n`
- Próximas `n` linhas: um comando cada:
  - `add <item>`: adiciona o item (uma palavra) no fim da lista; não imprime nada
  - `remove <item>`: remove a primeira ocorrência do item
  - `count`: quantos itens há na lista
  - `print`: mostra a lista

**Saída**

| Comando | Imprime |
|---------|---------|
| `remove` | `Removed <item>`, ou `<item> not found` |
| `count` | `Items: <tamanho>` |
| `print` | os itens separados por `, `, ou `(empty)` |

**O que você precisa saber**

- `List<String> items = new ArrayList<>();` cria uma lista vazia.
- `items.add(x)`, `items.remove(x)` (retorna `true` se removeu algo), `items.size()`, `items.isEmpty()`.
- `String.join(", ", items)` junta os itens em uma única String.
