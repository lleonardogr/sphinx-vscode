record Sale(String region, String product, int quantity, double price) {}

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    List<Sale> sales = Stream.generate(IO::readln)
            .limit(n)
            .map(line -> line.trim().split(" "))
            .map(p -> new Sale(p[0], p[1], Integer.parseInt(p[2]), Double.parseDouble(p[3])))
            .toList();
    double total = sales.stream().mapToDouble(s -> s.quantity() * s.price()).sum();
    IO.println("Total revenue: %.2f".formatted(total));
    IO.println("By region:");
    sales.stream()
            .collect(Collectors.groupingBy(Sale::region, Collectors.summingDouble(s -> s.quantity() * s.price())))
            .entrySet().stream()
            .sorted(Map.Entry.<String, Double>comparingByValue().reversed().thenComparing(Map.Entry.comparingByKey()))
            .forEach(e -> IO.println("  %s: %.2f".formatted(e.getKey(), e.getValue())));
    Map.Entry<String, Integer> best = sales.stream()
            .collect(Collectors.groupingBy(Sale::product, Collectors.summingInt(Sale::quantity)))
            .entrySet().stream()
            .sorted(Map.Entry.<String, Integer>comparingByValue().reversed().thenComparing(Map.Entry.comparingByKey()))
            .findFirst().orElseThrow();
    IO.println("Best seller: " + best.getKey() + " (" + best.getValue() + " units)");
}
