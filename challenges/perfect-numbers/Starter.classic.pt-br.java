import java.util.Scanner;

public class Main {

    // TODO: devolva a soma dos divisores próprios de n (todos os divisores menos o próprio n)
    static long sumOfDivisors(long n) {
        return 0;
    }

    // TODO: devolva "perfect", "abundant" ou "deficient", usando sumOfDivisors
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
