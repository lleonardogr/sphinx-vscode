import java.util.Scanner;

public class Main {

    static int steps = 0;

    static long power(long base, long exp, long mod) {
        if (exp == 0) {
            return 1 % mod;
        }
        steps++;
        long half = power(base * base % mod, exp / 2, mod);
        return exp % 2 == 1 ? half * (base % mod) % mod : half;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        long a = scanner.nextLong();
        long n = scanner.nextLong();
        long m = scanner.nextLong();
        long result = power(a % m, n, m);
        System.out.println("Result: " + result);
        System.out.println("Fast steps: " + steps);
        System.out.println("Naive steps: " + n);
    }
}
