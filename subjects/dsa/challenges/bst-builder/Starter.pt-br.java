void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" +");
    int[] keys = new int[n];
    for (int i = 0; i < n; i++) {
        keys[i] = Integer.parseInt(parts[i]);
    }

    // TODO: insira as chaves numa árvore binária de busca e depois imprima os percursos, a altura e as folhas
}
