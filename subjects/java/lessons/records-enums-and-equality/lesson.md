## In short

A **record** is a class for plain data in one line: `record Song(String title, int seconds) {}` writes the constructor, the accessors `title()` and `seconds()`, `toString`, `equals` and `hashCode`, and its fields never change. An **enum** lists a fixed set of values, such as `enum Size { SMALL, MEDIUM, LARGE }`.

```java
record Song(String title, int seconds) {}

enum Size { SMALL, MEDIUM, LARGE }

void main() {
    Song a = new Song("Intro", 95);
    Song b = new Song("Intro", 95);
    IO.println(a == b);          // false: two objects
    IO.println(a.equals(b));     // true: the same values
    Set<Song> playlist = new HashSet<>(List.of(a, b));
    IO.println(playlist.size()); // 1: equal songs count once

    Size s = Size.valueOf("MEDIUM");
    IO.println(s + " is size number " + (s.ordinal() + 1));
}
```

`==` asks "the same object?"; `equals` asks "the same values?". A plain class inherits an `equals` that only compares references, so to compare values you override `equals` **and** `hashCode` together.

**Watch out:** two objects that are `equals` must have the same `hashCode`, or a `HashSet` or `HashMap` treats them as different.

<!-- readings -->
