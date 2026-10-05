import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String[] values = scanner.nextLine().trim().split(" ");
        long sum = 0;
        int valid = 0;
        for (String value : values) {
            int number;
            try {
                number = Integer.parseInt(value);
            } catch (NumberFormatException e) {
                System.out.println("Skipped: " + value);
                continue;
            }
            sum += number;
            valid++;
        }
        System.out.println("Valid numbers: " + valid);
        System.out.println("Sum: " + sum);
    }
}
