# Your First Class

A **class** is a blueprint, and an **object** is something built from it. Create a class `Person` and use it to introduce several people.

The class needs:

- two **fields**: `String name` and `int age`
- a **constructor** `Person(String name, int age)` that stores the values
- a **method** `String introduce()` that returns `Hi, I'm <name> and I'm <age> years old.`

**Input**

- Line 1: the number of people `n`
- Next `n` lines: a name (one word) and an age

**Output**

One introduction per person.

**Things to know**

- `new Person("Ana", 20)` calls the constructor and creates an object.
- Inside the constructor, `this.name = name;` copies the parameter into the field.


> **Classic Java:** write your classes in the same `Main.java` file, above or below `public class Main`, *without* the `public` keyword (only one class per file can be public).
