import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] numbers = new int[n];

        // TODO: read the n numbers into the array
        for (int i = 0; i < n; i++) {
            numbers[i] = scanner.nextInt();
        }

        int target = scanner.nextInt();

        // TODO: count how many times target appears in the array, then print it
    }
}
