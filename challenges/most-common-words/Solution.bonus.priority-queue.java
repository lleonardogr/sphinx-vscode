void main() {
    int k = Integer.parseInt(IO.readln().trim());
    String text = IO.readln();
    Map<String, Integer> counts = new HashMap<>();
    for (String word : text.toLowerCase().split("[^a-z]+")) {
        if (!word.isEmpty()) counts.merge(word, 1, Integer::sum);
    }
    // A heap of at most k words, with the weakest on top, so it is the one pushed out.
    Comparator<Map.Entry<String, Integer>> weakestFirst = Map.Entry.<String, Integer>comparingByValue()
            .thenComparing(Map.Entry.<String, Integer>comparingByKey().reversed());
    PriorityQueue<Map.Entry<String, Integer>> top = new PriorityQueue<>(weakestFirst);
    for (Map.Entry<String, Integer> entry : counts.entrySet()) {
        top.add(entry);
        if (top.size() > k) {
            top.poll();
        }
    }
    List<Map.Entry<String, Integer>> best = new ArrayList<>();
    while (!top.isEmpty()) {
        best.add(0, top.poll());
    }
    for (Map.Entry<String, Integer> entry : best) {
        IO.println(entry.getKey() + ": " + entry.getValue());
    }
}
