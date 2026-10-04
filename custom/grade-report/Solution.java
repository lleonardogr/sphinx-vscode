void main() {
    Scanner scanner = new Scanner(System.in);
    int n = scanner.nextInt();
    int sum = 0;
    int highest = Integer.MIN_VALUE;
    int lowest = Integer.MAX_VALUE;
    int passed = 0;
    for (int i = 0; i < n; i++) {
        int grade = scanner.nextInt();
        sum += grade;
        highest = Math.max(highest, grade);
        lowest = Math.min(lowest, grade);
        if (grade >= 60) {
            passed++;
        }
    }
    IO.println("Average: %.2f".formatted((double) sum / n));
    IO.println("Highest: " + highest);
    IO.println("Lowest: " + lowest);
    IO.println("Passed: " + passed + " of " + n);
}
