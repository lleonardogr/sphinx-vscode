## In short

Collections grow and shrink as you add and remove items, unlike arrays. A **List** keeps the order and allows repeats; a **Set** keeps one copy of each item.

```java
void main() {
    List<String> cart = new ArrayList<>();
    cart.add("apple");
    cart.add("bread");
    cart.add("apple");
    cart.add(1, "milk");                 // at index 1
    IO.println(cart + " " + cart.size());
    cart.remove("bread");
    IO.println(cart.get(0) + " " + cart.contains("milk"));

    Set<String> kinds = new TreeSet<>(cart);
    IO.println(kinds);                   // [apple, milk]: sorted, no repeats
}
```

`HashSet` is fastest but has no useful order, `LinkedHashSet` keeps the order items arrived in, and `TreeSet` keeps them sorted.

**Watch out:** collections hold objects, so write `List<Integer>`, not `List<int>`.

<!-- readings -->
