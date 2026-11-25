import java.util.*;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        long k = scanner.nextLong();
        long[] prefix = new long[n + 1];
        for (int i = 1; i <= n; i++) {
            prefix[i] = prefix[i - 1] + scanner.nextInt();
        }
        // First pass: count the matches. Second pass: the longest match, with the first day of each total.
        Map<Long, Integer> counts = new HashMap<>();
        long periods = 0;
        for (int j = 0; j <= n; j++) {
            Integer c = counts.get(prefix[j] - k);
            if (c != null) {
                periods += c;
            }
            counts.put(prefix[j], counts.containsKey(prefix[j]) ? counts.get(prefix[j]) + 1 : 1);
        }
        Map<Long, Integer> first = new HashMap<>();
        int longest = 0;
        for (int j = 0; j <= n; j++) {
            Integer i = first.get(prefix[j] - k);
            if (i != null && j - i > longest) {
                longest = j - i;
            }
            if (!first.containsKey(prefix[j])) {
                first.put(prefix[j], j);
            }
        }
        System.out.println("periods: " + periods);
        System.out.println("longest: " + longest);
    }
}
