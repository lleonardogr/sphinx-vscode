import java.util.Scanner;

public class Main {

    // TODO: return the sum of the proper divisors of n (every divisor except n itself)
    static long sumOfDivisors(long n) {
        return 0;
    }

    // TODO: return "perfect", "abundant" or "deficient", using sumOfDivisors
    static String classify(long n) {
        return "";
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int t = scanner.nextInt();
        for (int i = 0; i < t; i++) {
            long n = scanner.nextLong();
            System.out.println(n + " is " + classify(n));
        }
    }
}
