## Em resumo

`if` roda um bloco só quando a condição dele é `true`. As condições comparam valores com `==`, `!=`, `<`, `<=`, `>` e `>=`, e se combinam com `&&` (e), `||` (ou) e `!` (não).

```java
void main() {
    int age = Integer.parseInt(IO.readln());
    int day = Integer.parseInt(IO.readln()); // 1 = segunda … 7 = domingo
    if (age < 12) {
        IO.println("Ingresso infantil");
    } else if (age >= 65 || day == 3) {
        IO.println("Ingresso com desconto");
    } else {
        IO.println("Ingresso inteiro");
    }
    String kind = switch (day) {
        case 6, 7 -> "fim de semana";
        default -> "dia de semana";
    };
    IO.println(age >= 18 ? "Adulto num " + kind : "Menor num " + kind);
}
```

O Java testa o `if` e depois cada `else if`, de cima para baixo, e roda só o **primeiro** bloco cuja condição é verdadeira.

**Cuidado:** a ordem importa. Com `if (age >= 18)` antes de `if (age >= 65)`, o segundo teste nunca é alcançado.

<!-- readings -->
