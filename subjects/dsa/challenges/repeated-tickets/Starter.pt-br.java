void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" +");
    int[] ids = new int[n];
    for (int i = 0; i < n; i++) {
        ids[i] = Integer.parseInt(parts[i]);
    }

    // TODO: conte quantos ids diferentes aparecem mais de uma vez, rápido o bastante para 200.000 ingressos
}
