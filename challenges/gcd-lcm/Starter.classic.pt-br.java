import java.util.Scanner;

public class Main {

    // TODO: devolva o máximo divisor comum de a e b (algoritmo de Euclides)
    static int gcd(int a, int b) {
        return 1;
    }

    // TODO: devolva o mínimo múltiplo comum de a e b, usando gcd
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
