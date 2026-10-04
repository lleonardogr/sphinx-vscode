void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" ");
    int sum = 0;
    for (int i = 0; i < n; i++) {
        int value = Integer.parseInt(parts[i]);
        if (value % 2 == 0) {
            sum += value;
        }
    }
    IO.println(sum);
}
