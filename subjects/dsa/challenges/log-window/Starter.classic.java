import java.util.*;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] times = new int[n];
        for (int i = 0; i < n; i++) {
            times[i] = scanner.nextInt();
        }
        int q = scanner.nextInt();
        long total = 0;
        int busiest = 0;
        for (int i = 0; i < q; i++) {
            int a = scanner.nextInt();
            int b = scanner.nextInt();

            // TODO: count the timestamps with a <= t <= b using binary search, and update total and busiest
        }
        System.out.println("total: " + total);
        System.out.println("busiest: " + busiest);
    }
}
