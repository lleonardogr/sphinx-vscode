void main() {
    String[] words = IO.readln().trim().split(" ");
    Set<String> unique = new LinkedHashSet<>();
    for (String word : words) {
        unique.add(word);
    }
    IO.println("Unique: " + String.join(" ", unique));
    IO.println("Removed duplicates: " + (words.length - unique.size()));
}
