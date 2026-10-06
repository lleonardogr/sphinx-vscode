int twoPointers(int[] numbers, int target) {
    int[] sorted = Arrays.copyOf(numbers, numbers.length);
    Arrays.sort(sorted);
    int checks = 0;
    int lo = 0;
    int hi = sorted.length - 1;
    while (lo < hi) {
        checks++;
        int sum = sorted[lo] + sorted[hi];
        if (sum == target) {
            break;
        } else if (sum < target) {
            lo++;
        } else {
            hi--;
        }
    }
    return checks;
}

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" ");
    int[] numbers = new int[n];
    for (int i = 0; i < n; i++) {
        numbers[i] = Integer.parseInt(parts[i]);
    }
    int target = Integer.parseInt(IO.readln().trim());
    int checks = 0;
    String pair = "none";
    search:
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            checks++;
            if (numbers[i] + numbers[j] == target) {
                pair = numbers[i] + " + " + numbers[j];
                break search;
            }
        }
    }
    IO.println("Pair: " + pair);
    IO.println("Brute force: " + checks);
    IO.println("Two pointers: " + twoPointers(numbers, target));
}
