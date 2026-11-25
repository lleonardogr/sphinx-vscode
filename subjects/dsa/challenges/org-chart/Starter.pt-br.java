void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" +");
    int[] manager = new int[n + 1]; // manager[i] para os funcionários 2..n; o funcionário 1 é o CEO
    for (int i = 2; i <= n; i++) {
        manager[i] = Integer.parseInt(parts[i - 2]);
    }

    // TODO: calcule o nível de cada funcionário e depois imprima as quatro linhas
}
