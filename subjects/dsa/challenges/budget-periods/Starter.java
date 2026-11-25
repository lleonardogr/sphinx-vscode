void main() {
    String[] first = IO.readln().trim().split(" +");
    int n = Integer.parseInt(first[0]);
    long k = Long.parseLong(first[1]);
    String[] parts = IO.readln().trim().split(" +");
    int[] change = new int[n];
    for (int i = 0; i < n; i++) {
        change[i] = Integer.parseInt(parts[i]);
    }

    // TODO: count the periods that add up to k with prefix sums and a HashMap, and find the longest
}
