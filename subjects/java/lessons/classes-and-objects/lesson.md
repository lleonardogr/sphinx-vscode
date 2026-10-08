## In short

A **class** describes a kind of object: its **fields** (what it knows) and its **methods** (what it does). `new` creates an object, and the **constructor** sets it up. Keep fields `private`, so other code goes through the methods.

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
    mix.add(new Song("Theme", 210));
    IO.println(mix.totalSeconds() + " seconds");
    IO.println(new Song("Intro", 95));
}
```

A **record** writes the constructor, getters, `toString` and `equals` for you. An `enum` lists fixed values. A class can `extend` another or `implement` an interface, and `@Override` replaces an inherited method.

**Watch out:** two objects with the same values aren't `==`. Compare them with `equals`: records have it already; in a class you write `equals` (and `hashCode`).

<!-- readings -->
