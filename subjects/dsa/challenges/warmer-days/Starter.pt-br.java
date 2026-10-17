void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" +");
    int[] temps = new int[n];
    for (int i = 0; i < n; i++) {
        temps[i] = Integer.parseInt(parts[i]);
    }

    // TODO: ache a espera de cada dia por um dia mais quente com uma pilha e depois imprima as três linhas
}
