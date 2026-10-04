# Animals (Interfaces)

An **interface** is a contract: it lists methods that a class promises to have, without saying how they work.

Create an interface `Animal` with two methods, `String name()` and `String sound()`, and four classes that **implement** it:

| Class | name() | sound() |
|-------|--------|---------|
| Dog   | dog    | Woof    |
| Cat   | cat    | Meow    |
| Cow   | cow    | Moo     |
| Duck  | duck   | Quack   |

Store the animals in an `Animal[]` array, then loop over it and let each one speak.

**Input**

- Line 1: the number of animals `n`
- Line 2: `n` animal types (`dog`, `cat`, `cow` or `duck`)

**Output**

For each animal, in order:

```
The dog says Woof!
```


> **Classic Java:** write your classes in the same `Main.java` file, above or below `public class Main`, *without* the `public` keyword (only one class per file can be public).
