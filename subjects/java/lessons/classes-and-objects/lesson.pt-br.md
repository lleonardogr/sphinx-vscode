## Em resumo

Uma **classe** descreve um tipo de objeto: os **campos** (o que cada objeto sabe) e os **métodos** (o que ele faz). O `new` cria um objeto, e o **construtor** (em que `this.name` é o campo e `name` o parâmetro) dá os primeiros valores aos campos. Uma variável de um tipo de classe guarda uma **referência** ao objeto, não o objeto em si.

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

Cada objeto tem a própria cópia dos campos; um campo `static` pertence à classe e é compartilhado por todos os objetos.

**Cuidado:** `Pet same = rex;` copia a referência, não o objeto. As duas variáveis agora mudam o mesmo pet.

<!-- readings -->
