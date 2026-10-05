import java.util.*;

class VendingException extends Exception {
    VendingException(String message) {
        super(message);
    }
}

class Product {
    final String name;
    final int price;
    int stock;

    Product(String name, int price, int stock) {
        this.name = name;
        this.price = price;
        this.stock = stock;
    }
}

class VendingMachine {
    private final Map<String, Product> products = new HashMap<>();
    private int credit = 0;

    void addProduct(String code, Product product) {
        products.put(code, product);
    }

    int insert(int cents) {
        credit += cents;
        return credit;
    }

    int select(String code) throws VendingException {
        Product p = products.get(code);
        if (p == null) throw new VendingException("Unknown product " + code);
        if (p.stock == 0) throw new VendingException("Sold out: " + p.name);
        if (credit < p.price) throw new VendingException("Insert " + (p.price - credit) + " more cents");
        p.stock--;
        int change = credit - p.price;
        credit = 0;
        return change;
    }

    int refund() {
        int amount = credit;
        credit = 0;
        return amount;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        VendingMachine machine = new VendingMachine();
        Map<String, String> names = new HashMap<>();
        int k = scanner.nextInt();
        for (int i = 0; i < k; i++) {
            String code = scanner.next();
            String name = scanner.next();
            machine.addProduct(code, new Product(name, scanner.nextInt(), scanner.nextInt()));
            names.put(code, name);
        }
        int n = scanner.nextInt();
        for (int i = 0; i < n; i++) {
            String command = scanner.next();
            if (command.equals("insert")) {
                System.out.println("Credit: " + machine.insert(scanner.nextInt()));
            } else if (command.equals("refund")) {
                System.out.println("Refunded " + machine.refund());
            } else {
                String code = scanner.next();
                try {
                int change = machine.select(code);
                System.out.println("Dispensed " + names.get(code) + ", change " + change);
            } catch (VendingException e) {
                System.out.println("Error: " + e.getMessage());
            }
            }
        }
    }
}
