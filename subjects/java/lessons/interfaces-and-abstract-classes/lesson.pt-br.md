## Em resumo

Uma **interface** é um contrato: ela lista métodos sem código, e qualquer classe pode prometer tê-los com `implements`. Uma **classe abstrata** é um pai que não pode ser criado com `new`: ela guarda campos e métodos prontos, e deixa alguns métodos `abstract` para cada subclasse escrever.

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
    Priced p = new StudentTicket("Show");
    IO.println(p.price());
}
```

Use uma **interface** quando classes sem parentesco compartilham uma capacidade (uma classe pode implementar várias). Use uma **classe abstrata** quando classes parentes compartilham estado e código (uma classe estende só uma).

**Cuidado:** os métodos que implementam uma interface precisam ser `public`, porque os métodos de interface são públicos.

<!-- readings -->
