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

    // TODO: sort the times, find the busiest window with two pointers, then simulate the limiter
}
