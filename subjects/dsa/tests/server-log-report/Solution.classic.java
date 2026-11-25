import java.util.*;

public class Main {

    // Counts the users and finds the most active one by sorting the ids: equal ids form runs.
    static int[] userStats(int[] users) {
        int[] ids = users.clone();
        Arrays.sort(ids);
        int distinct = 0, top = 0, topCount = 0;
        int i = 0;
        while (i < ids.length) {
            int j = i;
            while (j < ids.length && ids[j] == ids[i]) {
                j++;
            }
            distinct++;
            if (j - i > topCount) { // runs come in increasing id order, so ties keep the smaller id
                topCount = j - i;
                top = ids[i];
            }
            i = j;
        }
        return new int[] {distinct, top, topCount};
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] times = new int[n];
        int[] users = new int[n];
        int[] latencies = new int[n];
        for (int i = 0; i < n; i++) {
            times[i] = scanner.nextInt();
            users[i] = scanner.nextInt();
            latencies[i] = scanner.nextInt();
        }
        int[] stats = userStats(users);
        Arrays.sort(latencies);
        Arrays.sort(times);
        int busiest = 0, busiestStart = times[0], left = 0, quiet = 0;
        for (int right = 0; right < n; right++) {
            while (times[right] - times[left] >= 60) {
                left++;
            }
            if (right - left + 1 > busiest) {
                busiest = right - left + 1;
                busiestStart = times[left];
            }
            if (right > 0) {
                quiet = Math.max(quiet, times[right] - times[right - 1]);
            }
        }
        System.out.println("users: " + stats[0]);
        System.out.println("top user: " + stats[1]);
        System.out.println("top user requests: " + stats[2]);
        System.out.println("p95 latency: " + latencies[(95 * n + 99) / 100 - 1]);
        System.out.println("busiest minute: " + busiest);
        System.out.println("busiest minute starts: " + busiestStart);
        System.out.println("longest quiet: " + quiet);
    }
}
