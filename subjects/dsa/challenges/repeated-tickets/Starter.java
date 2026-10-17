void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" +");
    int[] ids = new int[n];
    for (int i = 0; i < n; i++) {
        ids[i] = Integer.parseInt(parts[i]);
    }

    // TODO: count how many different ids appear more than once, fast enough for 200,000 tickets
}
