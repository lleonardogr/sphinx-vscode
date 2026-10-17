import java.util.*;

public class Main {

    // Counting sort: the scores in ascending order, rebuilt from the counters.
    static int[] countingSort(int[] scores) {
        int[] counts = new int[101];
        for (int s : scores) {
            counts[s]++;
        }
        int[] ordered = new int[scores.length];
        int k = 0;
        for (int value = 0; value <= 100; value++) {
            for (int c = 0; c < counts[value]; c++) {
                ordered[k++] = value;
            }
        }
        return ordered;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] scores = new int[n];
        for (int i = 0; i < n; i++) {
            scores[i] = scanner.nextInt();
        }
        int[] ordered = countingSort(scores);
        int i = n - 1;
        while (i >= 0) {
            int j = i;
            while (j >= 0 && ordered[j] == ordered[i]) {
                j--;
            }
            System.out.println(ordered[i] + ": " + (i - j));
            i = j;
        }
        System.out.println("median: " + ordered[(n - 1) / 2]);
    }
}
