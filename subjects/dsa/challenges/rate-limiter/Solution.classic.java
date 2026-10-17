import java.util.*;

public class Main {

    // The earliest start and the size of the busiest window, as {start, count}.
    static int[] busiest(int[] sorted, int w) {
        int left = 0, bestCount = 0, bestStart = sorted[0];
        for (int right = 0; right < sorted.length; right++) {
            while (sorted[right] - sorted[left] >= w) {
                left++;
            }
            if (right - left + 1 > bestCount) {
                bestCount = right - left + 1;
                bestStart = sorted[left];
            }
        }
        return new int[] {bestStart, bestCount};
    }

    // How many requests a limiter of `limit` per `w` seconds rejects.
    static int rejected(int[] sorted, int w, int limit) {
        ArrayDeque<Integer> recent = new ArrayDeque<>();
        int rejected = 0;
        for (int t : sorted) {
            while (!recent.isEmpty() && recent.peekFirst() <= t - w) {
                recent.pollFirst();
            }
            if (recent.size() < limit) {
                recent.addLast(t);
            } else {
                rejected++;
            }
        }
        return rejected;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int w = scanner.nextInt();
        int limit = scanner.nextInt();
        int[] times = new int[n];
        for (int i = 0; i < n; i++) {
            times[i] = scanner.nextInt();
        }
        Arrays.sort(times);
        int[] best = busiest(times, w);
        System.out.println("busiest start: " + best[0]);
        System.out.println("busiest count: " + best[1]);
        System.out.println("rejected: " + rejected(times, w, limit));
    }
}
