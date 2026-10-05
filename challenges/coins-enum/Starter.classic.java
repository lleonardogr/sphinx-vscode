import java.util.*;

enum Coin {
    // TODO: give each coin its value in cents: PENNY 1, NICKEL 5, DIME 10, QUARTER 25
    PENNY, NICKEL, DIME, QUARTER;

    int cents() {
        return 0;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String[] names = scanner.nextLine().trim().split(" +");

        // TODO: count the coins, report unknown names, then print each coin's count and the total
    }
}
