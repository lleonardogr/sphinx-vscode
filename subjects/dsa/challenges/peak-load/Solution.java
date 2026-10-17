void main() {
    String[] first = IO.readln().trim().split(" +");
    int n = Integer.parseInt(first[0]);
    int k = Integer.parseInt(first[1]);
    String[] parts = IO.readln().trim().split(" +");
    int[] load = new int[n];
    for (int i = 0; i < n; i++) {
        load[i] = Integer.parseInt(parts[i]);
    }
    // Indexes whose loads go down from front to back: the front is the window's peak.
    Deque<Integer> window = new ArrayDeque<>();
    int bestStart = 0;
    int bestPeak = Integer.MAX_VALUE;
    for (int i = 0; i < n; i++) {
        while (!window.isEmpty() && load[window.peekLast()] <= load[i]) {
            window.pollLast();
        }
        window.offerLast(i);
        if (window.peekFirst() <= i - k) {
            window.pollFirst();
        }
        if (i >= k - 1 && load[window.peekFirst()] < bestPeak) {
            bestPeak = load[window.peekFirst()];
            bestStart = i - k + 1;
        }
    }
    IO.println("best start: " + (bestStart + 1));
    IO.println("best peak: " + bestPeak);
}
