/** How many days the packages take with a truck of this capacity (at least the heaviest package). */
int days(int[] weights, long capacity) {
    int days = 1;
    long load = 0;
    for (int w : weights) {
        if (load + w > capacity) {
            days++;
            load = 0;
        }
        load += w;
    }
    return days;
}

void main() {
    String[] first = IO.readln().trim().split(" +");
    int n = Integer.parseInt(first[0]);
    int d = Integer.parseInt(first[1]);
    String[] parts = IO.readln().trim().split(" +");
    int[] weights = new int[n];
    long lo = 0;
    long hi = 0;
    for (int i = 0; i < n; i++) {
        weights[i] = Integer.parseInt(parts[i]);
        lo = Math.max(lo, weights[i]);
        hi += weights[i];
    }
    while (lo < hi) {
        long mid = (lo + hi) / 2;
        if (days(weights, mid) <= d) {
            hi = mid;
        } else {
            lo = mid + 1;
        }
    }
    IO.println(lo);
}
