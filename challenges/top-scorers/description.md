# Top 3 Scorers

Build a leaderboard. Each player is a `record Player(String name, int score)` (already declared). Print the **top 3** players by score.

- Higher scores come first.
- Players with the **same score** are ordered by name, alphabetically.
- If there are fewer than 3 players, print them all.

**Solve it without `for` or `while` loops.**

**Input**

One line of `name:score` entries separated by single spaces, for example `ana:90 bruno:75 carla:95`.

**Output**

```
1. carla (95)
2. ana (90)
3. bruno (75)
```

**Things to know**

- `Comparator.comparingInt(Player::score)` sorts by score (lowest first). `.reversed()` flips it, and `.thenComparing(Player::name)` breaks ties.
- `.limit(3)` keeps the first 3 elements, and `.toList()` collects them into a `List`.
- `IntStream.range(0, n)` is a stream of the numbers `0 … n-1`, which is useful for the ranking numbers.
