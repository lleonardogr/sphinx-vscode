import java.util.Scanner;

public class Main {

    // TODO: return the greatest common divisor of a and b (Euclid's algorithm)
    static int gcd(int a, int b) {
        return 1;
    }

    // TODO: return the least common multiple of a and b, using gcd
    static long lcm(int a, int b) {
        return 1;
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
