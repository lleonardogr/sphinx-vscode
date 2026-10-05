import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        StringJoiner primes = new StringJoiner(" ");
        int count = 0;
        for (int k = 2; k <= n; k++) {
            int d = 2;
            while (d * d <= k && k % d != 0) d++;
            if (d * d > k) {
                primes.add(String.valueOf(k));
                count++;
            }
        }
        System.out.println(count == 0 ? "No primes" : primes.toString());
        System.out.println("Count: " + count);
    }
}
