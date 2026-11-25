void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" +");
    int[] manager = new int[n + 1]; // manager[i] for employees 2..n; employee 1 is the CEO
    for (int i = 2; i <= n; i++) {
        manager[i] = Integer.parseInt(parts[i - 2]);
    }

    // TODO: compute every employee's level, then print the four lines
}
