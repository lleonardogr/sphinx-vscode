## In short

Collections grow and shrink as you add and remove items. A **List** keeps the order and allows repeats; a **Set** keeps one copy of each item; a **Map** links each **key** to a value.

```java
void main() {
    Map<String, Double> prices = new HashMap<>();
    prices.put("apple", 0.5);
    prices.put("bread", 2.25);
    List<String> cart = new ArrayList<>();
    cart.add("apple");
    cart.add("bread");
    cart.add("apple");
    double total = 0;
    for (String item : cart) {
        total += prices.getOrDefault(item, 0.0);
    }
    Set<String> kinds = new HashSet<>(cart);
    IO.println(cart.size() + " items, " + kinds.size() + " different, total " + total);
}
```

`Hash…` collections are fast but unordered, `Linked…` ones keep the order items arrived in, and `Tree…` ones keep them sorted. An `ArrayDeque` works as a queue or a stack.

**Watch out:** collections hold objects, so write `List<Integer>`, not `List<int>`.

<!-- readings -->
