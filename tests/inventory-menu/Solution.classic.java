import java.util.*;

public class Main {
    static void printItems(Map<String, Integer> items) {
        for (String product : items.keySet()) {
            System.out.println(product + ": " + items.get(product));
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Map<String, Integer> stock = new TreeMap<>();
        System.out.println("=== Inventory ===");
        System.out.println("1. Add stock");
        System.out.println("2. Sell");
        System.out.println("3. Show inventory");
        System.out.println("4. Search");
        System.out.println("0. Exit");

        String option = scanner.nextLine().trim();
        while (!option.equals("0")) {
            if (option.equals("1") || option.equals("2")) {
                String product = scanner.next().toLowerCase();
                int quantity = scanner.nextInt();
                scanner.nextLine();
                int current = stock.getOrDefault(product, 0);
                if (quantity <= 0) {
                    System.out.println("Invalid quantity");
                } else if (option.equals("1")) {
                    stock.put(product, current + quantity);
                    System.out.println(product + ": " + (current + quantity));
                } else if (!stock.containsKey(product)) {
                    System.out.println(product + " not found");
                } else if (quantity > current) {
                    System.out.println("Not enough " + product + " (only " + current + " left)");
                } else {
                    int left = current - quantity;
                    if (left == 0) {
                        stock.remove(product);
                    } else {
                        stock.put(product, left);
                    }
                    System.out.println("Sold " + quantity + " " + product + ", " + left + " left");
                }
            } else if (option.equals("3")) {
                if (stock.isEmpty()) {
                    System.out.println("Inventory is empty");
                } else {
                    printItems(stock);
                    int total = 0;
                    for (int quantity : stock.values()) {
                        total += quantity;
                    }
                    System.out.println("Total units: " + total);
                }
            } else if (option.equals("4")) {
                String text = scanner.nextLine().trim().toLowerCase();
                Map<String, Integer> matches = new TreeMap<>();
                for (String product : stock.keySet()) {
                    if (product.contains(text)) {
                        matches.put(product, stock.get(product));
                    }
                }
                if (matches.isEmpty()) {
                    System.out.println("No matches");
                } else {
                    printItems(matches);
                }
            } else {
                System.out.println("Invalid option");
            }
            option = scanner.nextLine().trim();
        }
        System.out.println("Goodbye!");
    }
}
