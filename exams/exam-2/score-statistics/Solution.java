void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" +");
    int[] numbers = new int[n];
    for (int i = 0; i < n; i++) {
        numbers[i] = Integer.parseInt(parts[i]);
    }
    int highest = numbers[0], lowest = numbers[0], passed = 0;
    for (int score : numbers) {
        if (score > highest) highest = score;
        if (score < lowest) lowest = score;
        if (score >= 60) passed++;
    }
    IO.println("Highest: " + highest);
    IO.println("Lowest: " + lowest);
    IO.println("Passed: " + passed + " of " + n);
}
