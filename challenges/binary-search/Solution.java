void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" +");
    int[] numbers = new int[n];
    for (int i = 0; i < n; i++) {
        numbers[i] = Integer.parseInt(parts[i]);
    }
    int q = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < q; i++) {
        int value = Integer.parseInt(IO.readln().trim());
        int low = 0, high = n - 1, steps = 0, found = -1;
        while (low <= high) {
            int mid = (low + high) / 2;
            steps++;
            if (numbers[mid] == value) {
                found = mid;
                break;
            } else if (numbers[mid] < value) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        IO.println(found >= 0 ? value + " found at index " + found + ", steps: " + steps : value + " not found, steps: " + steps);
    }
}
