## In short

A **class** describes a kind of object: its **fields** (what each object knows) and its **methods** (what it does). `new` creates an object, and the **constructor** (where `this.name` is the field and `name` the parameter) gives its fields their first values. A variable of a class type holds a **reference** to the object, not the object itself.

```java
class Pet {
    private final String name;
    private int age;
    static int count = 0;

    Pet(String name, int age) {
        this.name = name;
        this.age = age;
        count++;
    }

    void birthday() {
        age++;
    }

    @Override
    public String toString() {
        return name + " (" + age + ")";
    }
}

void main() {
    Pet rex = new Pet("Rex", 3);
    Pet same = rex;
    same.birthday();
    IO.println(rex + ", " + Pet.count + " pet(s)");
}
```

Each object has its own copy of the fields; a `static` field belongs to the class and is shared by all objects.

**Watch out:** `Pet same = rex;` copies the reference, not the object. Both variables now change the same pet.

<!-- readings -->
