void main() {
    Scanner scanner = new Scanner(System.in);
    String[] words = scanner.nextLine().toLowerCase().split(" ");
    Map<String, Integer> counts = new TreeMap<>();
    for (String word : words) {
        counts.merge(word, 1, Integer::sum);
    }
    for (Map.Entry<String, Integer> entry : counts.entrySet()) {
        IO.println(entry.getKey() + ": " + entry.getValue());
    }
}
