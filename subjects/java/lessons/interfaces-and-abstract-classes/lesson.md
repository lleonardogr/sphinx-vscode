## In short

An **interface** is a contract: it lists methods without code, and any class can promise to have them with `implements`. An **abstract class** is a parent that can't be created with `new`: it holds fields and finished methods, and leaves some methods `abstract` for each subclass to write.

```java
interface Priced {
    double price();
}

abstract class Ticket implements Priced {
    final String event;

    Ticket(String event) {
        this.event = event;
    }

    abstract double discount();

    public double price() {
        return 100 * (1 - discount());
    }
}

class StudentTicket extends Ticket {
    StudentTicket(String event) {
        super(event);
    }

    double discount() {
        return 0.5;
    }
}

void main() {
    Priced p = new StudentTicket("Concert");
    IO.println(p.price());
}
```

Use an **interface** when unrelated classes share a capability (a class can implement many). Use an **abstract class** when related classes share state and code (a class extends only one).

**Watch out:** methods that implement an interface must be `public`, because interface methods are public.

<!-- readings -->
