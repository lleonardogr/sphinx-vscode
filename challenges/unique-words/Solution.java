void main() {
    Scanner scanner = new Scanner(System.in);
    String[] words = scanner.nextLine().toLowerCase().split(" ");
    Set<String> seen = new HashSet<>();
    String firstRepeat = null;
    for (String word : words) {
        if (!seen.add(word) && firstRepeat == null) {
            firstRepeat = word;
        }
    }
    IO.println("Unique words: " + seen.size());
    IO.println(firstRepeat == null ? "No repeats" : "First repeat: " + firstRepeat);
}
