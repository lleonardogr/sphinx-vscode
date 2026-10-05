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

    // TODO: dispense the product and return the change, or throw a VendingException:
    //   "Unknown product CODE", "Sold out: NAME" or "Insert N more cents"
    int select(String code) throws VendingException {
        return 0;
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
                // TODO: select code: print "Dispensed NAME, change C" or "Error: " + the exception's message
            }
        }
    }
}
