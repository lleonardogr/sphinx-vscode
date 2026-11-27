## Em resumo

A orientação a objetos tem quatro pilares:

| Pilar | Significa |
|---|---|
| **Encapsulamento** | os campos são `private`; os métodos cuidam de cada mudança |
| **Herança** | `class Dog extends Animal` reaproveita e estende uma classe pai |
| **Polimorfismo** | uma variável `Animal` pode guardar qualquer subclasse, e cada uma responde do seu jeito |
| **Abstração** | o código trabalha com a ideia geral (`Animal`), não com os detalhes de cada tipo |

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
        return "Au";
    }
}

void main() {
    List<Animal> zoo = List.of(new Dog("Rex"), new Animal("Genérico"));
    for (Animal a : zoo) {
        IO.println(a.describe());
    }
}
```

O `describe()` chama `sound()`, e o Java escolhe a versão da classe do **objeto** enquanto o programa roda.

**Cuidado:** o `@Override` pede ao compilador para conferir que você realmente substitui um método do pai. Sem ele, um erro de digitação como `Sound()` cria um método novo sem avisar.

<!-- readings -->
