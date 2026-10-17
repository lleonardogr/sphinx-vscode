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

        // TODO: count the timestamps with a <= t <= b using binary search, and update total and busiest
    }
    IO.println("total: " + total);
    IO.println("busiest: " + busiest);
}
