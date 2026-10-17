/** The first index whose value is >= x, or times.length if there is none. */
int lowerBound(int[] times, long x) {
    int lo = 0;
    int hi = times.length;
    while (lo < hi) {
        int mid = (lo + hi) >>> 1;
        if (times[mid] < x) {
            lo = mid + 1;
        } else {
            hi = mid;
        }
    }
    return lo;
}

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" +");
    int[] times = new int[n];
    for (int i = 0; i < n; i++) {
        times[i] = Integer.parseInt(parts[i]);
    }
    int q = Integer.parseInt(IO.readln().trim());
    long total = 0;
    int busiest = 0;
    for (int i = 0; i < q; i++) {
        String[] window = IO.readln().trim().split(" +");
        int a = Integer.parseInt(window[0]);
        int b = Integer.parseInt(window[1]);
        int count = lowerBound(times, b + 1L) - lowerBound(times, a);
        total += count;
        busiest = Math.max(busiest, count);
    }
    IO.println("total: " + total);
    IO.println("busiest: " + busiest);
}
