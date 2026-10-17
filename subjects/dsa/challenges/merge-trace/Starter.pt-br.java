void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" +");
    int[] a = new int[n];
    for (int i = 0; i < n; i++) {
        a[i] = Integer.parseInt(parts[i]);
    }

    // TODO: intercale sequências de largura 1, 2, 4, ..., imprima o array depois de cada passada e depois as comparações
}
