void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" ");
    int[] bytes = new int[n];
    for (int i = 0; i < n; i++) {
        bytes[i] = Integer.parseInt(parts[i]);
    }
    // TODO: print one line per 16 bytes: offset, hex bytes, text
}
