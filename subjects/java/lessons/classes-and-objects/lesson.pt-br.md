## Em resumo

Uma **classe** descreve um tipo de objeto: seus **campos** (o que ele sabe) e seus **métodos** (o que ele faz). `new` cria um objeto, e o **construtor** o prepara. Deixe os campos `private`, para o resto do código passar pelos métodos.

```java
record Song(String title, int seconds) {}

class Playlist {
    private final List<Song> songs = new ArrayList<>();

    void add(Song song) {
        songs.add(song);
    }

    int totalSeconds() {
        int total = 0;
        for (Song s : songs) {
            total += s.seconds();
        }
        return total;
    }
}

void main() {
    Playlist mix = new Playlist();
    mix.add(new Song("Intro", 95));
    mix.add(new Song("Tema", 210));
    IO.println(mix.totalSeconds() + " segundos");
    IO.println(new Song("Intro", 95));
}
```

Um **record** escreve para você o construtor, os getters, o `toString` e o `equals`. Um `enum` lista valores fixos. Uma classe pode estender (`extends`) outra ou implementar (`implements`) uma interface, e `@Override` substitui um método herdado.

**Cuidado:** dois objetos com os mesmos valores não são `==`. Compare-os com `equals`: records já o têm; numa classe você escreve o `equals` (e o `hashCode`).

<!-- readings -->
