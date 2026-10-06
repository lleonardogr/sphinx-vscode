import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++) {
            numbers[i] = scanner.nextInt();
        }

        // TODO: for each pass, find the smallest of the rest, swap it into place and print the list;
        // then print the comparisons and the swaps
    }
}
