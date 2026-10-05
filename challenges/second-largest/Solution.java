void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" +");
    int[] numbers = new int[n];
    for (int i = 0; i < n; i++) {
        numbers[i] = Integer.parseInt(parts[i]);
    }
    int largest = numbers[0];
    int second = 0;
    boolean found = false;
    for (int x : numbers) {
        if (x > largest) {
            second = largest;
            largest = x;
            found = true;
        } else if (x < largest && (!found || x > second)) {
            second = x;
            found = true;
        }
    }
    IO.println(found ? "Second largest: " + second : "No second largest");
}
