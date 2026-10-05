import java.util.Scanner;

public class Main {

    static double toFahrenheit(double celsius) {
        return celsius * 1.8 + 32;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int start = scanner.nextInt();
        int end = scanner.nextInt();
        int step = scanner.nextInt();
        int c = start;
        while (c <= end) {
            System.out.printf("%d C = %.1f F%n", c, toFahrenheit(c));
            c += step;
        }
    }
}
