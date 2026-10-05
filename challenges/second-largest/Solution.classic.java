import java.util.*;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++) {
            numbers[i] = scanner.nextInt();
        }
        int largest = Integer.MIN_VALUE;
        for (int x : numbers) if (x > largest) largest = x;
        Integer second = null;
        for (int x : numbers) {
            if (x != largest && (second == null || x > second)) second = x;
        }
        System.out.println(second == null ? "No second largest" : "Second largest: " + second);
    }
}
