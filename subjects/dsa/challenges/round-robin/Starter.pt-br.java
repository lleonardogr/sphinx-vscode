void main() {
    String[] first = IO.readln().trim().split(" +");
    int n = Integer.parseInt(first[0]);
    int slice = Integer.parseInt(first[1]);
    String[] names = new String[n];
    int[] needs = new int[n];
    for (int i = 0; i < n; i++) {
        String[] parts = IO.readln().trim().split(" +");
        names[i] = parts[0];
        needs[i] = Integer.parseInt(parts[1]);
    }

    // TODO: rode os processos em turnos com uma fila, imprima quando cada um termina e depois a espera média
}
