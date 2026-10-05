void main() {
    String[] first = IO.readln().trim().split(" ");
    int n = Integer.parseInt(first[0]);
    int k = Integer.parseInt(first[1]);
    String[] parts = IO.readln().trim().split(" +");
    int[] numbers = new int[n];
    for (int i = 0; i < n; i++) {
        numbers[i] = Integer.parseInt(parts[i]);
    }

    // TODO: rotate the array k steps to the right and print it
}
