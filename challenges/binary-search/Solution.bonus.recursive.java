int steps;

/* The index of value between low and high, or -1, counting the steps. */
int search(int[] numbers, int value, int low, int high) {
    if (low > high) {
        return -1;
    }
    int mid = (low + high) / 2;
    steps++;
    if (numbers[mid] == value) {
        return mid;
    }
    return numbers[mid] < value ? search(numbers, value, mid + 1, high) : search(numbers, value, low, mid - 1);
}

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
        steps = 0;
        int found = search(numbers, value, 0, n - 1);
        IO.println(found >= 0 ? value + " found at index " + found + ", steps: " + steps : value + " not found, steps: " + steps);
    }
}
