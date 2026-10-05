import java.util.*;

enum Coin {
    PENNY(1), NICKEL(5), DIME(10), QUARTER(25);

    private final int cents;

    Coin(int cents) {
        this.cents = cents;
    }

    int cents() {
        return cents;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String[] names = scanner.nextLine().trim().split(" +");
        int[] counts = new int[Coin.values().length];
        for (String name : names) {
            try {
                counts[Coin.valueOf(name.toUpperCase()).ordinal()]++;
            } catch (IllegalArgumentException e) {
                System.out.println("Unknown coin: " + name);
            }
        }
        int total = 0;
        for (Coin coin : Coin.values()) {
            if (counts[coin.ordinal()] > 0) System.out.println(coin + " x" + counts[coin.ordinal()]);
            total += counts[coin.ordinal()] * coin.cents();
        }
        System.out.println("Total: " + total + " cents");
    }
}
