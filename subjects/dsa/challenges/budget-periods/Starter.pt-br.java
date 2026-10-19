void main() {
    String[] first = IO.readln().trim().split(" +");
    int n = Integer.parseInt(first[0]);
    long k = Long.parseLong(first[1]);
    String[] parts = IO.readln().trim().split(" +");
    int[] change = new int[n];
    for (int i = 0; i < n; i++) {
        change[i] = Integer.parseInt(parts[i]);
    }

    // TODO: conte os períodos que somam k com somas de prefixo e um HashMap, e ache o mais longo
}
