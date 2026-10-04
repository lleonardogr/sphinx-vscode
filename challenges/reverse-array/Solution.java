void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split("\\s+");
    int[] numbers = new int[n];
    for (int i = 0; i < n; i++) {
        numbers[i] = Integer.parseInt(parts[i]);
    }
    for (int i = n - 1; i >= 0; i--) {
        IO.print(numbers[i] + " ");
    }
    IO.println();
}
