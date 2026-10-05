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

        // TODO: faça a busca binária por value, contando os passos, e imprima o resultado
    }
}
