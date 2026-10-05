void main() {
    String[] first = IO.readln().trim().split(" ");
    int n = Integer.parseInt(first[0]);
    int k = Integer.parseInt(first[1]);
    String[] parts = IO.readln().trim().split(" +");
    int[] numbers = new int[n];
    for (int i = 0; i < n; i++) {
        numbers[i] = Integer.parseInt(parts[i]);
    }
    int[] rotated = new int[n];
    for (int i = 0; i < n; i++) {
        rotated[(i + k % n) % n] = numbers[i];
    }
    StringBuilder out = new StringBuilder();
    for (int i = 0; i < n; i++) {
        if (i > 0) out.append(' ');
        out.append(rotated[i]);
    }
    IO.println(out);
}
