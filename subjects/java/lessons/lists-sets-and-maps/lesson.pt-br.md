## Em resumo

Coleções crescem e diminuem conforme você põe e tira itens, ao contrário dos arrays. Uma **List** mantém a ordem e aceita repetidos; um **Set** guarda uma cópia de cada item.

```java
void main() {
    List<String> cart = new ArrayList<>();
    cart.add("maçã");
    cart.add("pão");
    cart.add("maçã");
    cart.add(1, "leite");                // no índice 1
    IO.println(cart + " " + cart.size());
    cart.remove("pão");
    IO.println(cart.get(0) + " " + cart.contains("leite"));

    Set<String> kinds = new TreeSet<>(cart);
    IO.println(kinds);                   // [leite, maçã]: ordenado, sem repetidos
}
```

`HashSet` é o mais rápido, mas não tem ordem útil, `LinkedHashSet` mantém a ordem de chegada, e `TreeSet` os mantém ordenados.

**Cuidado:** coleções guardam objetos, então escreva `List<Integer>`, não `List<int>`.

<!-- readings -->
