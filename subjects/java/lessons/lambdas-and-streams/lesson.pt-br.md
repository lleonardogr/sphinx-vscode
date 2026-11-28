## Em resumo

Uma **lambda** é uma pequena função escrita como valor: `n -> n % 2 == 0` recebe `n` e responde verdadeiro ou falso. Uma **referência a método** como `String::length` cita um método que já existe. Muitos métodos recebem uma delas para saber *o que fazer*: quais itens tirar, ou como comparar dois itens.

```java
record Player(String name, int score) {}

void main() {
    Predicate<Integer> isEven = n -> n % 2 == 0;
    IO.println(isEven.test(4));

    List<Player> table = new ArrayList<>(List.of(
            new Player("Caio", 50), new Player("Ana", 75), new Player("Bia", 50)));
    table.sort(Comparator.comparingInt(Player::score).reversed()
            .thenComparing(Player::name));
    IO.println(table);   // Ana 75, depois Bia e Caio, empatados em 50
}
```

Um comparador devolve um número negativo, zero ou positivo, dizendo qual de dois itens vem primeiro.

**Cuidado:** uma lambda só pode usar uma variável local se essa variável nunca mudar depois de receber o valor.

<!-- readings -->
