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

void main() {
    VendingMachine machine = new VendingMachine();
    Map<String, String> names = new HashMap<>();
    int k = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < k; i++) {
        String[] p = IO.readln().trim().split(" ");
        machine.addProduct(p[0], new Product(p[1], Integer.parseInt(p[2]), Integer.parseInt(p[3])));
        names.put(p[0], p[1]);
    }
    int n = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < n; i++) {
        String[] p = IO.readln().trim().split(" ");
        if (p[0].equals("insert")) {
            IO.println("Credit: " + machine.insert(Integer.parseInt(p[1])));
        } else if (p[0].equals("refund")) {
            IO.println("Refunded " + machine.refund());
        } else {
            try {
                int change = machine.select(p[1]);
                IO.println("Dispensed " + names.get(p[1]) + ", change " + change);
            } catch (VendingException e) {
                IO.println("Error: " + e.getMessage());
            }
        }
    }
}
