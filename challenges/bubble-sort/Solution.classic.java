import java.util.*;

public class Main {

    static String join(int[] a) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < a.length; i++) {
            if (i > 0) sb.append(' ');
            sb.append(a[i]);
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++) {
            numbers[i] = scanner.nextInt();
        }
        for (int pass = 1; pass < n; pass++) {
            boolean swapped = false;
            for (int j = 0; j + 1 < n - pass + 1; j++) {
                if (numbers[j] > numbers[j + 1]) {
                    int tmp = numbers[j];
                    numbers[j] = numbers[j + 1];
                    numbers[j + 1] = tmp;
                    swapped = true;
                }
            }
            if (!swapped) break;
            System.out.println("Pass " + pass + ": " + join(numbers));
        }
        System.out.println("Sorted: " + join(numbers));
    }
}
