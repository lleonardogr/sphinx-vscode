# Colchetes balanceados (pilha)

Uma **pilha** é "o último a entrar é o primeiro a sair", como uma pilha de pratos: você só pode pegar o prato de cima. Pilhas são perfeitas para conferir colchetes.

Um texto está **balanceado** quando cada `(`, `[` e `{` é fechado pelo `)`, `]` ou `}` correspondente, na ordem certa. Os outros caracteres são ignorados.

| Texto | Resultado |
|-------|-----------|
| `([]{})` | Balanceado |
| `([)]` | Não balanceado (fechado na ordem errada) |
| `((` | Não balanceado (nunca fechado) |

**Entrada**

Uma linha de texto.

**Saída**

`Balanced` (balanceado) ou `Not balanced` (não balanceado).

**O que você precisa saber**

- `Deque<Character> stack = new ArrayDeque<>();`
- `stack.push(c)` coloca no topo, `stack.pop()` remove e devolve o topo, `stack.isEmpty()` diz se está vazia.
