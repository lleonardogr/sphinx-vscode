## In short

A **Map** links each **key** to a value, like a dictionary links a word to its meaning. Each key appears once: putting it again replaces its value.

```java
void main() {
    Map<String, Integer> votes = new HashMap<>();
    for (String v : List.of("red", "blue", "red", "green", "red")) {
        votes.merge(v, 1, Integer::sum);       // add 1, starting at 1
    }
    IO.println(votes.get("red"));               // 3
    IO.println(votes.getOrDefault("pink", 0));  // 0: no such key

    Map<String, Integer> sorted = new TreeMap<>(votes);
    for (Map.Entry<String, Integer> e : sorted.entrySet()) {
        IO.println(e.getKey() + ": " + e.getValue());
    }
}
```

`HashMap` has no useful key order, `LinkedHashMap` keeps insertion order, `TreeMap` keeps keys sorted, and `EnumMap` follows an enum's order.

**Watch out:** `get` returns `null` for a missing key, and using that `null` as a number crashes. Prefer `getOrDefault`.

<!-- readings -->
