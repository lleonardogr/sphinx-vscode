String join(int[] a) {
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < a.length; i++) {
        if (i > 0) sb.append(' ');
        sb.append(a[i]);
    }
    return sb.toString();
}

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" +");
    int[] numbers = new int[n];
    for (int i = 0; i < n; i++) {
        numbers[i] = Integer.parseInt(parts[i]);
    }
    int pass = 0;
    boolean swapped = true;
    while (swapped) {
        swapped = false;
        for (int j = 0; j < n - 1; j++) {
            if (numbers[j] > numbers[j + 1]) {
                int tmp = numbers[j];
                numbers[j] = numbers[j + 1];
                numbers[j + 1] = tmp;
                swapped = true;
            }
        }
        if (swapped) {
            pass++;
            IO.println("Pass " + pass + ": " + join(numbers));
        }
    }
    IO.println("Sorted: " + join(numbers));
}
