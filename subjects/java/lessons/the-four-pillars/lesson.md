## In short

OOP has four pillars:

| Pillar | Means |
|---|---|
| **Encapsulation** | `private` fields, changed only through methods |
| **Inheritance** | `class Dog extends Animal` reuses and extends a parent class |
| **Polymorphism** | an `Animal` variable holds any subclass, each answering its own way |
| **Abstraction** | code uses the general idea (`Animal`), not each kind's details |

```java
class Animal {
    private final String name;

    Animal(String name) {
        this.name = name;
    }

    String describe() {
        return name + ": " + sound();
    }

    String sound() {
        return "...";
    }
}

class Dog extends Animal {
    Dog(String name) {
        super(name);
    }

    @Override
    String sound() {
        return "Woof";
    }
}

void main() {
    List<Animal> zoo = List.of(new Dog("Rex"), new Animal("Generic"));
    for (Animal a : zoo) {
        IO.println(a.describe());
    }
}
```

`describe()` calls `sound()`, and Java picks the version of the **object's** class while the program runs.

**Watch out:** `@Override` asks the compiler to check that you really replace a parent's method. Without it, a typo such as `Sound()` silently creates a new method.

<!-- readings -->
