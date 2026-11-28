## In short

A **lambda** is a small function written as a value: `n -> n % 2 == 0` takes `n` and answers true or false. A **method reference** such as `String::length` names an existing method instead. Many methods take one to know *what to do*: which items to remove, or how to compare two items.

```java
record Player(String name, int score) {}

void main() {
    Predicate<Integer> isEven = n -> n % 2 == 0;
    IO.println(isEven.test(4));

    List<Player> table = new ArrayList<>(List.of(
            new Player("Caio", 50), new Player("Ana", 75), new Player("Bia", 50)));
    table.sort(Comparator.comparingInt(Player::score).reversed()
            .thenComparing(Player::name));
    IO.println(table);   // Ana 75, then Bia and Caio, tied at 50
}
```

A comparator returns a negative number, zero or a positive number, saying which of two items comes first.

**Watch out:** a lambda can use a local variable only if that variable never changes after it is set.

<!-- readings -->
