import java.util.*;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] days = new int[n];
        for (int i = 0; i < n; i++) {
            days[i] = scanner.nextInt();
        }
        // Sorted, a streak is a run of values that grow by exactly 1 (repeats are skipped).
        Arrays.sort(days);
        int longest = 1, start = days[0];
        int length = 1, runStart = days[0];
        for (int i = 1; i < n; i++) {
            if (days[i] == days[i - 1]) {
                continue;
            }
            if (days[i] == days[i - 1] + 1) {
                length++;
            } else {
                length = 1;
                runStart = days[i];
            }
            if (length > longest) {
                longest = length;
                start = runStart;
            }
        }
        System.out.println("longest streak: " + longest);
        System.out.println("starts on day: " + start);
    }
}
