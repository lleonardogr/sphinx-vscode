void main() {
    Scanner scanner = new Scanner(System.in);
    int n = scanner.nextInt();
    int[] numbers = new int[n];
    for (int i = 0; i < n; i++) {
        numbers[i] = scanner.nextInt();
    }
    int max = numbers[0];
    int min = numbers[0];
    for (int number : numbers) {
        if (number > max) {
            max = number;
        }
        if (number < min) {
            min = number;
        }
    }
    IO.println("Max: " + max);
    IO.println("Min: " + min);
}
