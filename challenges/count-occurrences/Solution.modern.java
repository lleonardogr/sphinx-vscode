void main() {
    Scanner scanner = new Scanner(System.in);
    int n = scanner.nextInt();
    int[] numbers = new int[n];
    for (int i = 0; i < n; i++) {
        numbers[i] = scanner.nextInt();
    }
    int target = scanner.nextInt();
    int count = 0;
    for (int number : numbers) {
        if (number == target) {
            count++;
        }
    }
    IO.println(count);
}
