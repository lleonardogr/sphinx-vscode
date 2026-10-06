void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" ");
    int[] numbers = new int[n];
    for (int i = 0; i < n; i++) {
        numbers[i] = Integer.parseInt(parts[i]);
    }
    int target = Integer.parseInt(IO.readln().trim());

    // TODO: count the steps of a linear search and of a binary search, then print the three lines
}
