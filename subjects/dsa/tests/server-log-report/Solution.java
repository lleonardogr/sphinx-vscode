void main() {
    int n = Integer.parseInt(IO.readln().trim());
    int[] times = new int[n];
    int[] latencies = new int[n];
    Map<Integer, Integer> perUser = new HashMap<>();
    for (int i = 0; i < n; i++) {
        String[] parts = IO.readln().trim().split(" +");
        times[i] = Integer.parseInt(parts[0]);
        perUser.merge(Integer.parseInt(parts[1]), 1, Integer::sum);
        latencies[i] = Integer.parseInt(parts[2]);
    }

    int topUser = 0;
    int topCount = 0;
    for (var e : perUser.entrySet()) {
        if (e.getValue() > topCount || (e.getValue() == topCount && e.getKey() < topUser)) {
            topUser = e.getKey();
            topCount = e.getValue();
        }
    }

    Arrays.sort(latencies);
    int p95 = latencies[(95 * n + 99) / 100 - 1];

    Arrays.sort(times);
    int busiest = 0;
    int busiestStart = times[0];
    int j = 0;
    for (int i = 0; i < n; i++) {
        while (j < n && times[j] < (long) times[i] + 60) {
            j++;
        }
        if (j - i > busiest) {
            busiest = j - i;
            busiestStart = times[i];
        }
    }
    int quiet = 0;
    for (int i = 1; i < n; i++) {
        quiet = Math.max(quiet, times[i] - times[i - 1]);
    }

    IO.println("users: " + perUser.size());
    IO.println("top user: " + topUser);
    IO.println("top user requests: " + topCount);
    IO.println("p95 latency: " + p95);
    IO.println("busiest minute: " + busiest);
    IO.println("busiest minute starts: " + busiestStart);
    IO.println("longest quiet: " + quiet);
}
