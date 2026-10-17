import java.util.*;

public class Main {

    // Bottom-up merge sort that counts inversions: merges runs of 1, 2, 4, ... without recursion.
    static long countInversions(int[] a) {
        int n = a.length;
        int[] tmp = new int[n];
        long count = 0;
        for (int width = 1; width < n; width *= 2) {
            for (int lo = 0; lo < n - width; lo += 2 * width) {
                int mid = lo + width;
                int hi = Math.min(lo + 2 * width, n);
                int i = lo, j = mid, k = lo;
                while (i < mid || j < hi) {
                    if (j >= hi || (i < mid && a[i] <= a[j])) {
                        tmp[k++] = a[i++];
                    } else {
                        count += mid - i;
                        tmp[k++] = a[j++];
                    }
                }
                for (int t = lo; t < hi; t++) {
                    a[t] = tmp[t];
                }
            }
        }
        return count;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] ranking = new int[n];
        for (int i = 0; i < n; i++) {
            ranking[i] = scanner.nextInt();
        }
        long different = countInversions(ranking);
        long pairs = (long) n * (n - 1) / 2;
        double agreement = pairs == 0 ? 100.0 : 100.0 * (pairs - different) / pairs;
        System.out.println("different pairs: " + different);
        System.out.println(String.format("agreement: %.1f%%", agreement));
    }
}
