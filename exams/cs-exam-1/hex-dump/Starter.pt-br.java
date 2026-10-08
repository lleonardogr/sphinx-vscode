void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" ");
    int[] bytes = new int[n];
    for (int i = 0; i < n; i++) {
        bytes[i] = Integer.parseInt(parts[i]);
    }
    // TODO: imprima uma linha a cada 16 bytes: deslocamento, bytes em hexadecimal, texto
}
