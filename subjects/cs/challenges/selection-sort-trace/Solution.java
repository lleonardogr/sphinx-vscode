void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" ");
    int[] numbers = new int[n];
    for (int i = 0; i < n; i++) {
        numbers[i] = Integer.parseInt(parts[i]);
    }
    int comparisons = 0;
    int swaps = 0;
    for (int i = 0; i < n - 1; i++) {
        int min = i;
        for (int j = i + 1; j < n; j++) {
            comparisons++;
            if (numbers[j] < numbers[min]) {
                min = j;
            }
        }
        if (min != i) {
            int tmp = numbers[i];
            numbers[i] = numbers[min];
            numbers[min] = tmp;
            swaps++;
        }
        StringBuilder line = new StringBuilder();
        for (int k = 0; k < n; k++) {
            line.append(k == 0 ? "" : " ").append(numbers[k]);
        }
        IO.println(line);
    }
    IO.println("Comparisons: " + comparisons);
    IO.println("Swaps: " + swaps);
}
