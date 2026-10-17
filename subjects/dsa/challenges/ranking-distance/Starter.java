void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" +");
    int[] ranking = new int[n];
    for (int i = 0; i < n; i++) {
        ranking[i] = Integer.parseInt(parts[i]);
    }

    // TODO: count the inversions with a merge sort, then print them and the agreement
}
