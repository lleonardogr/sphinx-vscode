## Em resumo

Um **record** é uma classe para dados simples numa linha: `record Song(String title, int seconds) {}` escreve o construtor, os acessores `title()` e `seconds()`, o `toString`, o `equals` e o `hashCode`, e os campos dele nunca mudam. Um **enum** lista um conjunto fixo de valores, como `enum Size { SMALL, MEDIUM, LARGE }`.

```java
record Song(String title, int seconds) {}

enum Size { SMALL, MEDIUM, LARGE }

void main() {
    Song a = new Song("Intro", 95);
    Song b = new Song("Intro", 95);
    IO.println(a == b);          // false: dois objetos
    IO.println(a.equals(b));     // true: os mesmos valores
    Set<Song> playlist = new HashSet<>(List.of(a, b));
    IO.println(playlist.size()); // 1: músicas iguais contam uma vez

    Size s = Size.valueOf("MEDIUM");
    IO.println(s + " é o tamanho número " + (s.ordinal() + 1));
}
```

`==` pergunta "o mesmo objeto?"; `equals` pergunta "os mesmos valores?". Uma classe comum herda um `equals` que só compara referências, então para comparar valores você sobrescreve o `equals` **e** o `hashCode` juntos.

**Cuidado:** dois objetos que são `equals` precisam ter o mesmo `hashCode`, senão um `HashSet` ou um `HashMap` os trata como diferentes.

<!-- readings -->
