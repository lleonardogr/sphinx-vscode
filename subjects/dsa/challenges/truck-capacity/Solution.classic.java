import java.util.*;

public class Main {

    // True when a truck of this capacity ships everything within the given days.
    static boolean fits(int[] weights, long capacity, int days) {
        int used = 0;
        int i = 0;
        while (i < weights.length) {
            if (weights[i] > capacity) {
                return false;
            }
            used++;
            long load = 0;
            while (i < weights.length && load + weights[i] <= capacity) {
                load += weights[i];
                i++;
            }
        }
        return used <= days;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int d = scanner.nextInt();
        int[] weights = new int[n];
        long total = 0;
        for (int i = 0; i < n; i++) {
            weights[i] = scanner.nextInt();
            total += weights[i];
        }
        long lo = 1, hi = total, best = total;
        while (lo <= hi) {
            long mid = lo + (hi - lo) / 2;
            if (fits(weights, mid, d)) {
                best = mid;
                hi = mid - 1;
            } else {
                lo = mid + 1;
            }
        }
        System.out.println(best);
    }
}
