import java.util.Scanner;

public class Main {

    static String divide(int a, int b) {
        try {
            return a + " / " + b + " = " + (a / b);
        } catch (ArithmeticException e) {
            return "Cannot divide by zero";
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int t = scanner.nextInt();
        for (int i = 0; i < t; i++) {
            System.out.println(divide(scanner.nextInt(), scanner.nextInt()));
        }
    }
}
