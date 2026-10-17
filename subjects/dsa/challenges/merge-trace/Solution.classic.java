import java.util.*;

public class Main {

    // One pass: merges every pair of neighbouring runs of `src` into `dst` and returns the comparisons made.
    static int pass(int[] src, int[] dst, int width) {
        int n = src.length;
        int comparisons = 0;
        for (int lo = 0; lo < n; lo += 2 * width) {
            int mid = Math.min(lo + width, n);
            int hi = Math.min(lo + 2 * width, n);
            int i = lo, j = mid;
            for (int k = lo; k < hi; k++) {
                if (i < mid && j < hi) {
                    comparisons++;
                    dst[k] = src[i] <= src[j] ? src[i++] : src[j++];
                } else if (i < mid) {
                    dst[k] = src[i++];
                } else {
                    dst[k] = src[j++];
                }
            }
        }
        return comparisons;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) {
            a[i] = scanner.nextInt();
        }
        int[] other = new int[n];
        int total = 0;
        for (int width = 1; width < n; width *= 2) {
            total += pass(a, other, width);
            int[] swap = a;
            a = other;
            other = swap;
            StringBuilder line = new StringBuilder("width " + width + ":");
            for (int v : a) {
                line.append(' ').append(v);
            }
            System.out.println(line);
        }
        System.out.println("comparisons: " + total);
    }
}
