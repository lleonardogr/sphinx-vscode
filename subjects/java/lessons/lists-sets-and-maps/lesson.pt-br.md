## Em resumo

Coleções crescem e encolhem conforme você adiciona e remove itens. Uma **List** mantém a ordem e aceita repetidos; um **Set** guarda uma cópia de cada item; um **Map** liga cada **chave** a um valor.

```java
void main() {
    Map<String, Double> prices = new HashMap<>();
    prices.put("maçã", 0.5);
    prices.put("pão", 2.25);
    List<String> cart = new ArrayList<>();
    cart.add("maçã");
    cart.add("pão");
    cart.add("maçã");
    double total = 0;
    for (String item : cart) {
        total += prices.getOrDefault(item, 0.0);
    }
    Set<String> kinds = new HashSet<>(cart);
    IO.println(cart.size() + " itens, " + kinds.size() + " diferentes, total " + total);
}
```

Coleções `Hash…` são rápidas mas sem ordem, as `Linked…` mantêm a ordem de chegada e as `Tree…` mantêm tudo ordenado. Um `ArrayDeque` funciona como fila ou pilha.

**Cuidado:** coleções guardam objetos, então escreva `List<Integer>`, não `List<int>`.

<!-- readings -->
