void main() {
    String[] first = IO.readln().trim().split(" +");
    int n = Integer.parseInt(first[0]);
    int w = Integer.parseInt(first[1]);
    int limit = Integer.parseInt(first[2]);
    String[] parts = IO.readln().trim().split(" +");
    int[] times = new int[n];
    for (int i = 0; i < n; i++) {
        times[i] = Integer.parseInt(parts[i]);
    }
    Arrays.sort(times);

    // Busiest window: for each start i, j is the first time outside [times[i], times[i] + w).
    int bestStart = times[0];
    int bestCount = 0;
    int j = 0;
    for (int i = 0; i < n; i++) {
        while (j < n && (long) times[j] - times[i] < w) {
            j++;
        }
        if (j - i > bestCount) {
            bestCount = j - i;
            bestStart = times[i];
        }
    }

    // Limiter: accepted times stay sorted; oldest is the first one still inside (t - w, t].
    int[] accepted = new int[n];
    int count = 0;
    int oldest = 0;
    int rejected = 0;
    for (int t : times) {
        while (oldest < count && accepted[oldest] <= (long) t - w) {
            oldest++;
        }
        if (count - oldest < limit) {
            accepted[count++] = t;
        } else {
            rejected++;
        }
    }

    IO.println("busiest start: " + bestStart);
    IO.println("busiest count: " + bestCount);
    IO.println("rejected: " + rejected);
}
