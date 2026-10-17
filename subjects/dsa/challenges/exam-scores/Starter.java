void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" +");
    int[] scores = new int[n];
    for (int i = 0; i < n; i++) {
        scores[i] = Integer.parseInt(parts[i]);
    }

    // TODO: count each score, print the counts from 100 down to 0, then the median
}
