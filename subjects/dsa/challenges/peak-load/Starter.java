void main() {
    String[] first = IO.readln().trim().split(" +");
    int n = Integer.parseInt(first[0]);
    int k = Integer.parseInt(first[1]);
    String[] parts = IO.readln().trim().split(" +");
    int[] load = new int[n];
    for (int i = 0; i < n; i++) {
        load[i] = Integer.parseInt(parts[i]);
    }

    // TODO: keep each window's peak with a deque, and find the window with the smallest peak
}
