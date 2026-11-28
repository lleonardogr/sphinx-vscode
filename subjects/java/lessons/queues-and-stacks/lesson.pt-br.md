## Em resumo

Uma **fila** atende os itens na ordem em que chegaram: o primeiro a entrar é o primeiro a sair, como numa fila de banco. Uma **pilha** devolve o último item posto: o último a entrar é o primeiro a sair, como uma pilha de pratos. O `ArrayDeque` faz as duas coisas.

```java
void main() {
    Deque<String> line = new ArrayDeque<>();
    line.offer("Ana");                    // entra no fim
    line.offer("Bia");
    IO.println(line.poll() + " atendida, " + line + " esperando");

    Deque<String> undo = new ArrayDeque<>();
    undo.push("digitar a");               // no topo
    undo.push("digitar b");
    IO.println("desfazer " + undo.pop()); // a última ação primeiro

    Queue<Integer> urgent = new PriorityQueue<>(List.of(5, 1, 3));
    IO.println(urgent.poll());            // 1: o menor sai primeiro
}
```

`peek` olha o próximo item sem tirá-lo.

**Cuidado:** num deque vazio, `poll` e `peek` devolvem `null`, mas `pop` lança uma exceção. Confira `isEmpty()` antes.

<!-- readings -->
