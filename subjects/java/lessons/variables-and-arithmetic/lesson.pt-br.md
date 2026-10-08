## Em resumo

Um programa roda suas linhas de cima para baixo. Uma **variável** é uma caixa com nome para um valor, e o **tipo** dela diz o que cabe ali: `int` para números inteiros, `double` para números com decimais, `String` para texto.

```java
void main() {
    String name = IO.readln();
    int eggs = Integer.parseInt(IO.readln());
    IO.println("Oi, " + name + "!");
    IO.println("Caixas de 6: " + eggs / 6);
    IO.println("Sobram: " + eggs % 6);
    IO.println("Meia caixa: " + 6 / 2.0);
}
```

- `+` soma números e junta textos.
- `/` entre dois `int`s fica só com a parte inteira: `17 / 6` é `2`. `%` dá o resto: `17 % 6` é `5`.
- `IO.readln()` lê uma linha como texto; `Integer.parseInt` e `Double.parseDouble` a transformam em número.

**Cuidado:** `7 / 2` é `3`, não `3.5`. Escreva `7 / 2.0` quando precisar dos decimais.

<!-- readings -->
