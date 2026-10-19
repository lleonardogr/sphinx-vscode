import java.util.*;

public class Main {

    // The first index in sorted whose word is >= target.
    static int lowerBound(String[] sorted, String target) {
        int lo = 0, hi = sorted.length;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (sorted[mid].compareTo(target) < 0) {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }
        return lo;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        String[] words = new String[n];
        for (int i = 0; i < n; i++) {
            words[i] = scanner.next();
        }
        Arrays.sort(words);
        int q = scanner.nextInt();
        StringBuilder out = new StringBuilder();
        for (int i = 0; i < q; i++) {
            String prefix = scanner.next();
            // Words starting with prefix sit between prefix and prefix + '{' ('{' comes right after 'z').
            out.append(lowerBound(words, prefix + "{") - lowerBound(words, prefix)).append('\n');
        }
        System.out.print(out);
    }
}
