void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" +");
    int[] temps = new int[n];
    for (int i = 0; i < n; i++) {
        temps[i] = Integer.parseInt(parts[i]);
    }

    // TODO: find each day's wait for a warmer day with a stack, then print the three lines
}
