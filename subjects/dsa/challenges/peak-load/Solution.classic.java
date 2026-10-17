import java.util.*;

public class Main {

    // Window maxima without a deque: split the loads into blocks of k. A window covers the end of one
    // block and the start of the next, so its peak is max(suffix max, prefix max).
    static int[] windowPeaks(int[] load, int k) {
        int n = load.length;
        int[] prefix = new int[n];
        int[] suffix = new int[n];
        for (int i = 0; i < n; i++) {
            prefix[i] = (i % k == 0) ? load[i] : Math.max(prefix[i - 1], load[i]);
        }
        for (int i = n - 1; i >= 0; i--) {
            suffix[i] = (i == n - 1 || (i + 1) % k == 0) ? load[i] : Math.max(suffix[i + 1], load[i]);
        }
        int[] peaks = new int[n - k + 1];
        for (int s = 0; s + k <= n; s++) {
            peaks[s] = Math.max(suffix[s], prefix[s + k - 1]);
        }
        return peaks;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int k = scanner.nextInt();
        int[] load = new int[n];
        for (int i = 0; i < n; i++) {
            load[i] = scanner.nextInt();
        }
        int[] peaks = windowPeaks(load, k);
        int best = 0;
        for (int s = 1; s < peaks.length; s++) {
            if (peaks[s] < peaks[best]) {
                best = s;
            }
        }
        System.out.println("best start: " + (best + 1));
        System.out.println("best peak: " + peaks[best]);
    }
}
