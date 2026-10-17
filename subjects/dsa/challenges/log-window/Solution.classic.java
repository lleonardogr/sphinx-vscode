import java.util.*;

public class Main {

    // The first index with times[i] >= a.
    static int firstAtLeast(int[] times, int a) {
        int lo = 0, hi = times.length - 1, answer = times.length;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (times[mid] >= a) {
                answer = mid;
                hi = mid - 1;
            } else {
                lo = mid + 1;
            }
        }
        return answer;
    }

    // The first index with times[i] > b.
    static int firstAfter(int[] times, int b) {
        int lo = 0, hi = times.length - 1, answer = times.length;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (times[mid] > b) {
                answer = mid;
                hi = mid - 1;
            } else {
                lo = mid + 1;
            }
        }
        return answer;
    }

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
            int count = firstAfter(times, b) - firstAtLeast(times, a);
            total += count;
            if (count > busiest) {
                busiest = count;
            }
        }
        System.out.println("total: " + total);
        System.out.println("busiest: " + busiest);
    }
}
