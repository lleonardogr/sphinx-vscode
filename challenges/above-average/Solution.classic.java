import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++) {
            numbers[i] = scanner.nextInt();
        }
        int sum = 0;
        for (int number : numbers) {
            sum += number;
        }
        double average = (double) sum / n;
        int above = 0;
        for (int number : numbers) {
            if (number > average) {
                above++;
            }
        }
        System.out.printf("Average: %.2f%n", average);
        System.out.println("Above average: " + above);
    }
}
