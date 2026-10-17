int comparisons = 0;

/** Merges the sorted runs a[lo..mid) and a[mid..hi), taking the left value on a tie. */
void merge(int[] a, int lo, int mid, int hi) {
    int[] merged = new int[hi - lo];
    int i = lo;
    int j = mid;
    int k = 0;
    while (i < mid && j < hi) {
        comparisons++;
        if (a[i] <= a[j]) {
            merged[k++] = a[i++];
        } else {
            merged[k++] = a[j++];
        }
    }
    while (i < mid) {
        merged[k++] = a[i++];
    }
    while (j < hi) {
        merged[k++] = a[j++];
    }
    System.arraycopy(merged, 0, a, lo, merged.length);
}

String join(int[] a) {
    StringJoiner line = new StringJoiner(" ");
    for (int v : a) {
        line.add(String.valueOf(v));
    }
    return line.toString();
}

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" +");
    int[] a = new int[n];
    for (int i = 0; i < n; i++) {
        a[i] = Integer.parseInt(parts[i]);
    }
    for (int width = 1; width < n; width *= 2) {
        for (int lo = 0; lo < n; lo += 2 * width) {
            merge(a, lo, Math.min(lo + width, n), Math.min(lo + 2 * width, n));
        }
        IO.println("width " + width + ": " + join(a));
    }
    IO.println("comparisons: " + comparisons);
}
