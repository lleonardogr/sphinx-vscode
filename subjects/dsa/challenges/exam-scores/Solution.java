void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" +");
    int[] counts = new int[101];
    for (int i = 0; i < n; i++) {
        counts[Integer.parseInt(parts[i])]++;
    }
    for (int score = 100; score >= 0; score--) {
        if (counts[score] > 0) {
            IO.println(score + ": " + counts[score]);
        }
    }
    // The median is the first score whose running total passes position (n - 1) / 2.
    int position = (n - 1) / 2;
    int seen = 0;
    int median = 0;
    while (seen + counts[median] <= position) {
        seen += counts[median];
        median++;
    }
    IO.println("median: " + median);
}
