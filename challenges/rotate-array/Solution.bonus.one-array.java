void reverse(int[] a, int from, int to) {
    while (from < to) {
        int t = a[from];
        a[from] = a[to];
        a[to] = t;
        from++;
        to--;
    }
}

void main() {
    String[] first = IO.readln().trim().split(" ");
    int n = Integer.parseInt(first[0]);
    int k = Integer.parseInt(first[1]) % n;
    String[] parts = IO.readln().trim().split(" +");
    int[] numbers = new int[n];
    for (int i = 0; i < n; i++) {
        numbers[i] = Integer.parseInt(parts[i]);
    }
    reverse(numbers, 0, n - 1);
    reverse(numbers, 0, k - 1);
    reverse(numbers, k, n - 1);
    StringBuilder out = new StringBuilder();
    for (int i = 0; i < n; i++) {
        if (i > 0) out.append(' ');
        out.append(numbers[i]);
    }
    IO.println(out);
}
