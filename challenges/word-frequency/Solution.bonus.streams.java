void main() {
    Scanner scanner = new Scanner(System.in);
    String[] words = scanner.nextLine().toLowerCase().split(" ");
    Map<String, Long> counts = Arrays.stream(words)
        .collect(Collectors.groupingBy(w -> w, TreeMap::new, Collectors.counting()));
    counts.forEach((word, count) -> IO.println(word + ": " + count));
}
