## Em resumo

Quando algo dá errado, o Java **lança** uma exceção, e o programa para, a menos que algum código a **capture**. Coloque o código arriscado no `try`; um bloco `catch` só roda quando o tipo de exceção dele é lançado.

```java
int age(String text) {
    int value = Integer.parseInt(text.trim());
    if (value < 0 || value > 150) {
        throw new IllegalArgumentException("Não é uma idade real: " + value);
    }
    return value;
}

void main() {
    String line = IO.readln();
    try {
        IO.println("Ano que vem: " + (age(line) + 1));
    } catch (NumberFormatException e) {
        IO.println("Não é um número: " + line);
    } catch (IllegalArgumentException e) {
        IO.println(e.getMessage());
    }
}
```

Sua própria exceção é uma classe que estende `Exception` (quem chama tem que capturá-la ou declarar `throws`) ou `RuntimeException` (não precisa).

**Cuidado:** coloque o `catch` mais específico primeiro. `NumberFormatException` é um tipo de `IllegalArgumentException`, então na outra ordem o compilador recusa o código.

<!-- readings -->
