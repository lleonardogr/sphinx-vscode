void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" +");
    int[] scores = new int[n];
    for (int i = 0; i < n; i++) {
        scores[i] = Integer.parseInt(parts[i]);
    }

    // TODO: conte cada nota, imprima as contagens de 100 até 0 e depois a mediana
}
