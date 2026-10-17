import java.util.*;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[][] meetings = new int[n][2];
        for (int i = 0; i < n; i++) {
            meetings[i][0] = scanner.nextInt();
            meetings[i][1] = meetings[i][0] + scanner.nextInt();
        }
        Arrays.sort(meetings, (x, y) -> Integer.compare(x[0], y[0]));

        int blocks = 0;
        long busy = 0, longestGap = 0;
        int i = 0;
        int previousEnd = -1;
        while (i < n) {
            int start = meetings[i][0];
            int end = meetings[i][1];
            i++;
            while (i < n && meetings[i][0] <= end) {
                end = Math.max(end, meetings[i][1]);
                i++;
            }
            if (previousEnd >= 0) {
                longestGap = Math.max(longestGap, start - previousEnd);
            }
            blocks++;
            busy += end - start;
            previousEnd = end;
        }
        System.out.println("blocks: " + blocks);
        System.out.println("busy: " + busy);
        System.out.println("longest free gap: " + longestGap);
    }
}
