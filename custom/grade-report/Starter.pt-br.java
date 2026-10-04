void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" ");
    int[] grades = new int[n];
    for (int i = 0; i < n; i++) {
        grades[i] = Integer.parseInt(parts[i]);
    }

    // TODO: calcule a média, a maior, a menor e quantos passaram, e imprima o relatório
}
