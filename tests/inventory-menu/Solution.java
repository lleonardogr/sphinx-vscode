void printItems(Map<String, Integer> items) {
    for (Map.Entry<String, Integer> item : items.entrySet()) {
        IO.println(item.getKey() + ": " + item.getValue());
    }
}

void sell(Map<String, Integer> stock, String product, int quantity) {
    Integer current = stock.get(product);
    if (current == null) {
        IO.println(product + " not found");
    } else if (quantity > current) {
        IO.println("Not enough " + product + " (only " + current + " left)");
    } else {
        int left = current - quantity;
        if (left == 0) {
            stock.remove(product);
        } else {
            stock.put(product, left);
        }
        IO.println("Sold " + quantity + " " + product + ", " + left + " left");
    }
}

void main() {
    Map<String, Integer> stock = new TreeMap<>();
    IO.println("=== Inventory ===");
    IO.println("1. Add stock");
    IO.println("2. Sell");
    IO.println("3. Show inventory");
    IO.println("4. Search");
    IO.println("0. Exit");

    while (true) {
        String option = IO.readln().trim();
        if (option.equals("0")) {
            break;
        }
        switch (option) {
            case "1", "2" -> {
                String[] parts = IO.readln().trim().split("\\s+");
                String product = parts[0].toLowerCase();
                int quantity = Integer.parseInt(parts[1]);
                if (quantity <= 0) {
                    IO.println("Invalid quantity");
                } else if (option.equals("1")) {
                    stock.put(product, stock.getOrDefault(product, 0) + quantity);
                    IO.println(product + ": " + stock.get(product));
                } else {
                    sell(stock, product, quantity);
                }
            }
            case "3" -> {
                if (stock.isEmpty()) {
                    IO.println("Inventory is empty");
                } else {
                    printItems(stock);
                    int total = stock.values().stream().mapToInt(Integer::intValue).sum();
                    IO.println("Total units: " + total);
                }
            }
            case "4" -> {
                String text = IO.readln().trim().toLowerCase();
                Map<String, Integer> matches = new TreeMap<>();
                for (String product : stock.keySet()) {
                    if (product.contains(text)) {
                        matches.put(product, stock.get(product));
                    }
                }
                if (matches.isEmpty()) {
                    IO.println("No matches");
                } else {
                    printItems(matches);
                }
            }
            default -> IO.println("Invalid option");
        }
    }
    IO.println("Goodbye!");
}
