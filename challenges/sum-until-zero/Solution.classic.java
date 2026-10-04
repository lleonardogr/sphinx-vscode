import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int count = 0;
        int sum = 0;
        int number;
        do {
            number = scanner.nextInt();
            if (number != 0) {
                count++;
                sum += number;
            }
        } while (number != 0);
        System.out.println("Count: " + count);
        System.out.println("Sum: " + sum);
    }
}
