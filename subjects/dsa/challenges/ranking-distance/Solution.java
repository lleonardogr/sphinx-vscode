/** Sorts a[lo..hi) and returns how many inversions it had. */
long sortAndCount(int[] a, int[] tmp, int lo, int hi) {
    if (hi - lo < 2) {
        return 0;
    }
    int mid = (lo + hi) >>> 1;
    long count = sortAndCount(a, tmp, lo, mid) + sortAndCount(a, tmp, mid, hi);
    int i = lo;
    int j = mid;
    int k = lo;
    while (i < mid && j < hi) {
        if (a[i] <= a[j]) {
            tmp[k++] = a[i++];
        } else {
            count += mid - i; // a[j] jumps ahead of every value left in the left half
            tmp[k++] = a[j++];
        }
    }
    while (i < mid) {
        tmp[k++] = a[i++];
    }
    while (j < hi) {
        tmp[k++] = a[j++];
    }
    System.arraycopy(tmp, lo, a, lo, hi - lo);
    return count;
}

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" +");
    int[] ranking = new int[n];
    for (int i = 0; i < n; i++) {
        ranking[i] = Integer.parseInt(parts[i]);
    }
    long different = sortAndCount(ranking, new int[n], 0, n);
    long pairs = (long) n * (n - 1) / 2;
    double agreement = pairs == 0 ? 100.0 : 100.0 * (pairs - different) / pairs;
    IO.println("different pairs: " + different);
    IO.println(String.format("agreement: %.1f%%", agreement));
}
