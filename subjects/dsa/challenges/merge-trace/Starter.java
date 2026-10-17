void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" +");
    int[] a = new int[n];
    for (int i = 0; i < n; i++) {
        a[i] = Integer.parseInt(parts[i]);
    }

    // TODO: merge runs of width 1, 2, 4, ..., print the array after each pass, then the comparisons
}
