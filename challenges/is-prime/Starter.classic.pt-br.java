import java.util.Scanner;

public class Main {

    // TODO: retorne true se n for primo, e false caso contrário
    static boolean isPrime(int n) {
        return false;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int t = scanner.nextInt();
        for (int i = 0; i < t; i++) {
            int n = scanner.nextInt();
            if (isPrime(n)) {
                System.out.println(n + " is prime");
            } else {
                System.out.println(n + " is not prime");
            }
        }
    }
}
