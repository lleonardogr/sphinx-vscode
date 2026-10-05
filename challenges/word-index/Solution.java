record Entry(String word, int line) {}

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    List<String> lines = Stream.generate(IO::readln).limit(n).toList();
    Map<String, TreeSet<Integer>> index = IntStream.range(0, lines.size())
            .boxed()
            .flatMap(i -> Arrays.stream(lines.get(i).toLowerCase().split("[^a-z]+"))
                    .filter(word -> !word.isEmpty())
                    .map(word -> new Entry(word, i + 1)))
            .collect(Collectors.groupingBy(Entry::word, TreeMap::new,
                    Collectors.mapping(Entry::line, Collectors.toCollection(TreeSet::new))));
    index.forEach((word, where) -> IO.println(word + ": " + where.stream().map(String::valueOf).collect(Collectors.joining(", "))));
}
