import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++) {
            numbers[i] = scanner.nextInt();
        }
        int highest = 0, lowest = 100, passed = 0;
        for (int i = 0; i < n; i++) {
            highest = Math.max(highest, numbers[i]);
            lowest = Math.min(lowest, numbers[i]);
            if (numbers[i] >= 60) passed++;
        }
        System.out.println("Highest: " + highest);
        System.out.println("Lowest: " + lowest);
        System.out.println("Passed: " + passed + " of " + n);
    }
}
