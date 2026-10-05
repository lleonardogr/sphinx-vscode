void main() {
    int k = Integer.parseInt(IO.readln().trim());
    String text = IO.readln();
    Map<String, Integer> counts = new HashMap<>();
    for (String word : text.toLowerCase().split("[^a-z]+")) {
        if (!word.isEmpty()) counts.merge(word, 1, Integer::sum);
    }
    List<Map.Entry<String, Integer>> entries = new ArrayList<>(counts.entrySet());
    entries.sort(Map.Entry.<String, Integer>comparingByValue().reversed().thenComparing(Map.Entry.comparingByKey()));
    for (int i = 0; i < Math.min(k, entries.size()); i++) {
        IO.println(entries.get(i).getKey() + ": " + entries.get(i).getValue());
    }
}
