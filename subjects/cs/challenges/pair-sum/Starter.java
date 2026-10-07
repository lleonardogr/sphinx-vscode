void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" ");
    int[] numbers = new int[n];
    for (int i = 0; i < n; i++) {
        numbers[i] = Integer.parseInt(parts[i]);
    }
    int target = Integer.parseInt(IO.readln().trim());

    // TODO: brute force over every pair, then two pointers over a sorted copy, counting the sums each checks
}
