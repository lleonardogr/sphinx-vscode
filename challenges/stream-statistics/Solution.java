void main() {
    String line = new Scanner(System.in).nextLine().trim();
    IntSummaryStatistics stats = Arrays.stream(line.split(" "))
            .mapToInt(Integer::parseInt)
            .summaryStatistics();
    IO.println("Count: " + stats.getCount());
    IO.println("Sum: " + stats.getSum());
    IO.println("Min: " + stats.getMin());
    IO.println("Max: " + stats.getMax());
    IO.println(String.format("Average: %.2f", stats.getAverage()));
}
