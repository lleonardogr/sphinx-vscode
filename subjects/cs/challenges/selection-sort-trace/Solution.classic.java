import java.util.Scanner;

public class Main {

    static String show(int[] a) {
        String[] parts = new String[a.length];
        for (int i = 0; i < a.length; i++) {
            parts[i] = String.valueOf(a[i]);
        }
        return String.join(" ", parts);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++) {
            numbers[i] = scanner.nextInt();
        }
        int comparisons = 0, swaps = 0;
        for (int pass = 0; pass < n - 1; pass++) {
            int smallest = pass;
            for (int j = pass + 1; j < n; j++) {
                comparisons++;
                if (numbers[j] < numbers[smallest]) {
                    smallest = j;
                }
            }
            if (smallest != pass) {
                int t = numbers[pass];
                numbers[pass] = numbers[smallest];
                numbers[smallest] = t;
                swaps++;
            }
            System.out.println(show(numbers));
        }
        System.out.println("Comparisons: " + comparisons);
        System.out.println("Swaps: " + swaps);
    }
}
