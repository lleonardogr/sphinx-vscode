## Em resumo

Um **método** é um trecho de código com nome que você pode chamar quantas vezes quiser. Os **parâmetros** dele são os valores de que ele precisa; `return` devolve a resposta a quem o chamou. Um método `void` não devolve nada: ele só faz algo, como imprimir.

```java
double discounted(double price, int percent) {
    return price - price * percent / 100;
}

void printLine(int width) {
    IO.println("-".repeat(width));
}

void main() {
    double price = Double.parseDouble(IO.readln());
    printLine(20);
    IO.println("10% de desconto: " + discounted(price, 10));
    IO.println("25% de desconto: " + discounted(price, 25));
    printLine(20);
}
```

Cada método tem suas próprias variáveis: o `price` dentro de `discounted` é uma cópia do valor com que ele foi chamado.

**Cuidado:** `discounted(price, 10);` sozinho numa linha calcula a resposta e a joga fora. Use o resultado: imprima ou guarde, como em `double sale = discounted(price, 10);`.

<!-- readings -->
