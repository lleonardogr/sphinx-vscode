void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" ");
    int[] numbers = new int[n];
    for (int i = 0; i < n; i++) {
        numbers[i] = Integer.parseInt(parts[i]);
    }
    int sum = 0;
    for (int number : numbers) {
        sum += number;
    }
    double average = (double) sum / n;
    int above = 0;
    for (int number : numbers) {
        if (number > average) {
            above++;
        }
    }
    IO.println("Average: %.2f".formatted(average));
    IO.println("Above average: " + above);
}
