void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" ");
    int[] numbers = new int[n];
    for (int i = 0; i < n; i++) {
        numbers[i] = Integer.parseInt(parts[i]);
    }

    // TODO: for each pass, find the smallest of the rest, swap it into place and print the list;
    // then print the comparisons and the swaps
}
