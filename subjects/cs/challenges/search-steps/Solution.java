void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" ");
    int[] numbers = new int[n];
    for (int i = 0; i < n; i++) {
        numbers[i] = Integer.parseInt(parts[i]);
    }
    int target = Integer.parseInt(IO.readln().trim());
    int linear = 0;
    boolean found = false;
    for (int x : numbers) {
        linear++;
        if (x == target) {
            found = true;
            break;
        }
    }
    int binary = 0;
    int lo = 0;
    int hi = n - 1;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        binary++;
        if (numbers[mid] == target) {
            break;
        } else if (numbers[mid] < target) {
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    IO.println("Linear: " + linear);
    IO.println("Binary: " + binary);
    IO.println("Found: " + (found ? "yes" : "no"));
}
