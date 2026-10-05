import java.util.*;
import java.util.stream.*;

record Sale(String region, String product, int quantity, double price) {}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        List<Sale> sales = Stream.generate(scanner::nextLine).limit(n)
                .map(l -> l.trim().split(" "))
                .map(p -> new Sale(p[0], p[1], Integer.parseInt(p[2]), Double.parseDouble(p[3])))
                .collect(Collectors.toList());
        System.out.printf("Total revenue: %.2f%n", sales.stream().mapToDouble(s -> s.quantity() * s.price()).sum());
        System.out.println("By region:");
        TreeMap<String, Double> regions = sales.stream()
                .collect(Collectors.groupingBy(Sale::region, TreeMap::new, Collectors.summingDouble(s -> s.quantity() * s.price())));
        regions.entrySet().stream()
                .sorted((a, b) -> Double.compare(b.getValue(), a.getValue()))
                .forEach(e -> System.out.printf("  %s: %.2f%n", e.getKey(), e.getValue()));
        TreeMap<String, Integer> units = sales.stream()
                .collect(Collectors.groupingBy(Sale::product, TreeMap::new, Collectors.summingInt(Sale::quantity)));
        String best = units.keySet().stream().max(Comparator.comparing(units::get)).get();
        String first = units.keySet().stream().filter(k -> units.get(k).equals(units.get(best))).findFirst().get();
        System.out.println("Best seller: " + first + " (" + units.get(first) + " units)");
    }
}
