import java.util.Scanner;

public class Main {

    static int gcd(int a, int b) {
        return b == 0 ? a : gcd(b, a % b);
    }

    static long lcm(int a, int b) {
        long g = gcd(a, b);
        return a / g * b;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int t = scanner.nextInt();
        for (int i = 0; i < t; i++) {
            int a = scanner.nextInt();
            int b = scanner.nextInt();
            System.out.println("GCD = " + gcd(a, b) + ", LCM = " + lcm(a, b));
        }
    }
}
