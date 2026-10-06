void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" ");
    int[] numbers = new int[n];
    for (int i = 0; i < n; i++) {
        numbers[i] = Integer.parseInt(parts[i]);
    }

    // TODO: em cada passada, ache o menor do resto, troque-o para o lugar e imprima a lista;
    // depois imprima as comparações e as trocas
}
