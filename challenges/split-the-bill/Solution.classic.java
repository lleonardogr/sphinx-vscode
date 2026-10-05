import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        long cents = Math.round(scanner.nextDouble() * 100);
        int people = scanner.nextInt();
        int tip = scanner.nextInt();
        long each = (cents * (100 + tip) + 100L * people - 1) / (100L * people);
        System.out.printf("Each person pays: %d.%02d%n", each / 100, each % 100);
    }
}
