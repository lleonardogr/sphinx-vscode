import java.util.Scanner;

public class Main {

    static long sumOfDivisors(long n) {
        long sum = 0;
        for (long d = 1; d * d <= n; d++) {
            if (n % d != 0) continue;
            if (d != n) sum += d;
            long other = n / d;
            if (other != d && other != n) sum += other;
        }
        return sum;
    }

    static String classify(long n) {
        long s = sumOfDivisors(n);
        return s == n ? "perfect" : s > n ? "abundant" : "deficient";
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
