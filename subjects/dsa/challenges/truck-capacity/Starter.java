void main() {
    String[] first = IO.readln().trim().split(" +");
    int n = Integer.parseInt(first[0]);
    int d = Integer.parseInt(first[1]);
    String[] parts = IO.readln().trim().split(" +");
    int[] weights = new int[n];
    for (int i = 0; i < n; i++) {
        weights[i] = Integer.parseInt(parts[i]);
    }

    // TODO: binary-search the smallest capacity that ships every package in at most d days
}
