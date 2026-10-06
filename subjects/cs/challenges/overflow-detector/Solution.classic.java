import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        String op = scanner.next();
        int b = scanner.nextInt();
        long result;
        if (op.equals("+")) {
            result = (long) a + b;
        } else if (op.equals("-")) {
            result = (long) a - b;
        } else {
            result = (long) a * b;
        }
        if (result != (int) result) {
            System.out.println("Overflow");
        } else {
            System.out.println(result);
        }
    }
}
